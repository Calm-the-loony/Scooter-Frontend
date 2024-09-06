<?php
// Подключение к базе данных
require 'db_connection.php';
require 'vendor/autoload.php';  // Подключаем автозагрузчик Composer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['email'];

    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user) {
        // Создаем уникальный токен для восстановления пароля
        $token = bin2hex(random_bytes(50));
        $expires = date('U') + 1800; // Срок действия токена 30 минут

        // Сохраняем токен в базе данных
        $sql = "INSERT INTO password_resets (email, token, expires) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE token = VALUES(token), expires = VALUES(expires)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $email, $token, $expires);
        $stmt->execute();

        // Создаем ссылку для восстановления пароля
        $resetLink = "https://yourdomain.com/reset_password.php?token=" . $token;

        // Отправляем письмо с инструкцией по восстановлению пароля
        $mail = new PHPMailer(true);

        try {
            // Настройки сервера
            $mail->isSMTP();
            $mail->Host = 'smtp.yourdomain.com';  // Укажите SMTP сервер вашего провайдера
            $mail->SMTPAuth = true;
            $mail->Username = 'your-email@yourdomain.com';  // Ваш SMTP логин
            $mail->Password = 'your-email-password';  // Ваш SMTP пароль
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // От кого письмо
            $mail->setFrom('no-reply@yourdomain.com', 'Ваш сайт');

            // Кому отправляем
            $mail->addAddress($email);

            // Тема письма
            $mail->Subject = 'Восстановление пароля';

            // Тело письма
            $mail->isHTML(true);
            $mail->Body = "<p>Вы запросили восстановление пароля. Для смены пароля перейдите по ссылке ниже:</p>
                          <p><a href='$resetLink'>$resetLink</a></p>
                          <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>";

            // Отправляем письмо
            $mail->send();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();
    $conn->close();
}
?>
