<?php
session_start();

$response = array(
    'logged_in' => false
);

if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['name'] = $_SESSION['user_name'];
    $response['dob'] = $_SESSION['user_dob'];
    $response['address'] = $_SESSION['user_address'];
    $response['email'] = $_SESSION['user_email'];
}

echo json_encode($response);
?>
