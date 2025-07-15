<?php
header('Content-Type: application/json');
include 'koneksi.php';

// Ambil tahun & bulan unik dari tanggal setoran
$sql = "SELECT DISTINCT 
            YEAR(tanggal) AS tahun, 
            MONTH(tanggal) AS bulan 
        FROM setoran_sampah 
        ORDER BY tahun DESC, bulan DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
