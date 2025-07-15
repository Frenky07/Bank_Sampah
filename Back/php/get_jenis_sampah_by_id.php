<?php
include 'koneksi.php';

$id = $_GET['id'];
$result = $conn->query("SELECT * FROM jenis_sampah WHERE id = $id");
$data = $result->fetch_assoc();

echo json_encode($data);
?>
