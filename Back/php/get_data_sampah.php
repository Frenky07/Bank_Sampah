<?php
header('Content-Type: application/json');
include 'koneksi.php';

$where = [];

if (isset($_GET['id_jenis']) && $_GET['id_jenis'] !== '') {
    $id_jenis = $_GET['id_jenis'];
    $where[] = "s.id_jenis = '$id_jenis'";
}

if (isset($_GET['bulan']) && $_GET['bulan'] !== '') {
    $bulan = $_GET['bulan'];
    $where[] = "MONTH(s.tanggal) = '$bulan'";
}

if (isset($_GET['tahun']) && $_GET['tahun'] !== '') {
    $tahun = $_GET['tahun'];
    $where[] = "YEAR(s.tanggal) = '$tahun'";
}

$whereClause = "";
if (!empty($where)) {
    $whereClause = "WHERE " . implode(" AND ", $where);
}

$sql = "SELECT 
            s.id, 
            s.nama, 
            s.tanggal, 
            j.nama AS nama_jenis, 
            s.berat,
            s.total_harga   
        FROM setoran_sampah s
        JOIN jenis_sampah j ON s.id_jenis = j.id
        $whereClause
        ORDER BY s.tanggal DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

?>
