<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$nama = $data['nama'];
$tanggal = $data['tanggal'];
$jenis = $data['jenis'];
$berat = $data['berat'];
$total_harga = $data['total_harga'];

// Ambil harga/kg dari tabel jenis_sampah
$stmt = $conn->prepare("SELECT harga, id FROM jenis_sampah WHERE nama = ?");
$stmt->bind_param("s", $jenis);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result) {
    echo "Jenis sampah tidak valid.";
    exit;
}

$harga_per_kg = $result['harga'];
$id_jenis = $result['id'];
$total_harga = $harga_per_kg * $berat;

// Update data
$update = $conn->prepare("UPDATE setoran_sampah SET nama=?, tanggal=?, id_jenis=?, berat=?, total_harga=? WHERE id=?");
$update->bind_param("ssisdi", $nama, $tanggal, $id_jenis, $berat, $total_harga, $id);

if ($update->execute()) {
    echo "Data berhasil diperbarui!";
} else {
    echo "Gagal memperbarui data: " . $conn->error;
}
