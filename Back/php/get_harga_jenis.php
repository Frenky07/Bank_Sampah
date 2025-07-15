<?php
include 'koneksi.php';

$jenis = $_GET['jenis'];

$stmt = $conn->prepare("SELECT harga_per_kg FROM jenis_sampah WHERE nama_jenis = ?");
$stmt->bind_param("s", $jenis);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if ($result) {
    echo json_encode(['harga_per_kg' => $result['harga_per_kg']]);
} else {
    echo json_encode(['harga_per_kg' => 0]);
}
?>
