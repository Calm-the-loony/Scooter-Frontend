<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_SESSION['user_id'];
    $name = $_POST['name'];
    $dob = $_POST['dob'];
    $address = $_POST['address'];
    $email = $_POST['email'];

    // Подключение к базе данных
    $conn = new mysqli('localhost', 'root', '', 'my_database');

    if ($conn->connect_error) {
        die("Ошибка подключения: " . $conn->connect_error);
    }

    // Обновление данных пользователя
    $sql = "UPDATE users SET name = ?, dob = ?, address = ?, email = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $name, $dob, $address, $email, $id);

    if ($stmt->execute()) {
        echo "Данные обновлены успешно!";
    } else {
        echo "Ошибка: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
