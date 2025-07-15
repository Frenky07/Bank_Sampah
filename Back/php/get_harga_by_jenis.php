<?php
include 'koneksi.php';

$id = $_GET['id'];
$stmt = $conn->prepare("SELECT id, nama, deskripsi, harga, satuan FROM jenis_sampah WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

header('Content-Type: application/json');
echo json_encode($result);

?>