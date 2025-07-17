<?php
header('Content-Type: application/json');
include 'koneksi.php';

$where = [];

// Filter berdasarkan ID Jenis (untuk dashboard/filter jenis)
if (isset($_GET['id_jenis']) && $_GET['id_jenis'] !== '') {
    $id_jenis = $_GET['id_jenis'];
    $where[] = "s.id_jenis = '$id_jenis'";
}

// Filter berdasarkan bulan dan tahun
if (isset($_GET['bulan']) && $_GET['bulan'] !== '') {
    $bulan = $_GET['bulan'];
    $where[] = "MONTH(s.tanggal) = '$bulan'";
}
if (isset($_GET['tahun']) && $_GET['tahun'] !== '') {
    $tahun = $_GET['tahun'];
    $where[] = "YEAR(s.tanggal) = '$tahun'";
}

// Filter berdasarkan nama nasabah
if (isset($_GET['nama_nasabah']) && $_GET['nama_nasabah'] !== '') {
    $nama_nasabah = $_GET['nama_nasabah'];
    $where[] = "s.nama = '$nama_nasabah'";
}

// ✅ Tambahan: filter berdasarkan id_nasabah
if (isset($_GET['id_nasabah']) && $_GET['id_nasabah'] !== '') {
    $id_nasabah = $_GET['id_nasabah'];
    $where[] = "n.id = '$id_nasabah'";
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
            j.harga AS harga_per_kg, 
            s.berat,
            s.total_harga,
            n.nomorWA
        FROM setoran_sampah s
        JOIN jenis_sampah j ON s.id_jenis = j.id
        JOIN nasabah n ON s.nama = n.nama
        $whereClause
        ORDER BY s.tanggal DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
