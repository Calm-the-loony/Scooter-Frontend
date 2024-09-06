<?php
// Подключение к базе данных
require 'db_connection.php';

session_start();

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    $sql = "SELECT name, dob, address, email FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    echo json_encode($user);
} else {
    echo json_encode(['error' => 'Пользователь не авторизован']);
}

$stmt->close();
$conn->close();
?>
