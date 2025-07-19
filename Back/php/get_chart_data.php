<?php
include 'koneksi.php';

$tahun = isset($_GET['tahun']) ? $_GET['tahun'] : '';
$bulan = isset($_GET['bulan']) ? $_GET['bulan'] : '';

$where = [];
if ($tahun !== '') $where[] = "YEAR(ss.tanggal) = '$tahun'";
if ($bulan !== '') $where[] = "MONTH(ss.tanggal) = '$bulan'";
$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$query = "
    SELECT js.nama AS nama_jenis, SUM(ss.berat) AS total_berat, SUM(ss.berat * js.harga) AS total_pendapatan
    FROM setoran_sampah ss
    JOIN jenis_sampah js ON ss.id_jenis = js.id
    $whereClause
    GROUP BY ss.id_jenis
";

$result = mysqli_query($conn, $query);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        'jenis' => $row['nama_jenis'],
        'berat' => (float)$row['total_berat'],
        'pendapatan' => (float)$row['total_pendapatan']
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
