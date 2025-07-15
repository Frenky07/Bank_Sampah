<?php
header('Content-Type: application/json');
include 'koneksi.php'; // pastikan ini file koneksi ke database

$sql = "SELECT 
            s.id, 
            s.nama, 
            s.tanggal, 
            j.nama AS nama_jenis, 
            s.berat,
            s.total_harga   
        FROM setoran_sampah s
        JOIN jenis_sampah j ON s.id_jenis = j.id";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
