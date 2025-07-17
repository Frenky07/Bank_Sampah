<?php
include 'koneksi.php'; // pastikan koneksi berfungsi

// Query yang benar
$query = "
    SELECT js.nama AS nama_jenis, SUM(ss.berat) AS total_berat
    FROM setoran_sampah ss
    JOIN jenis_sampah js ON ss.id_jenis = js.id
    GROUP BY ss.id_jenis
";

$result = mysqli_query($conn, $query);

// Cek error SQL (jika ada)
if (!$result) {
    die("Query error: " . mysqli_error($conn));
}

// Siapkan array data untuk JSON
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        'jenis' => $row['nama_jenis'],
        'berat' => (float)$row['total_berat']
    ];
}

// Kembalikan sebagai JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
