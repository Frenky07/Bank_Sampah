<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$nama = $data['nama'];
$id_nasabah = $data['id_nasabah'];
$tanggal = $data['tanggal'];
$jenis = $data['jenis'];
$berat = $data['berat'];

// Ambil harga/kg dari tabel jenis_sampah
$stmt = $conn->prepare("SELECT harga_per_kg, id FROM jenis_sampah WHERE nama_jenis = ?");
$stmt->bind_param("s", $jenis);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result) {
    echo "Jenis sampah tidak valid.";
    exit;
}

$harga_per_kg = $result['harga_per_kg'];
$id_jenis = $result['id'];
$total_harga = $harga_per_kg * $berat;

// Update data
$update = $conn->prepare("UPDATE setoran_sampah SET nama=?, id_nasabah=?, tanggal=?, id_jenis=?, berat=?, total_harga=? WHERE id=?");
$update->bind_param("sisidii", $nama, $id_nasabah, $tanggal, $id_jenis, $berat, $total_harga, $id);

if ($update->execute()) {
    echo "Data berhasil diperbarui!";
} else {
    echo "Gagal memperbarui data: " . $conn->error;
}
