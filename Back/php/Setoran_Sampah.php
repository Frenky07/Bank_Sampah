<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$berat = $_POST['berat'];
$total_harga = $berat * 2000;
$tanggal = isset($_POST['Tanggal']) ? $_POST['Tanggal'] : date('Y-m-d');
$id_nasabah = $_POST['id_nasabah']; // ← yang digunakan, bukan nama
$id_jenis = $_POST['id_jenis'];

$sql = "INSERT INTO setoran_sampah (nama, id_nasabah, tanggal, id_jenis, berat, total_harga)
        VALUES ('$nama', '$id_nasabah', '$tanggal', '$id_jenis', '$berat', '$total_harga')";

if ($conn->query($sql) === TRUE) {
    echo "Data berhasil disimpan!";
    header('Location: ../../Front/HTML/Setoran_Sampah.html');
    exit();
} else {
    echo "Gagal menyimpan data: " . $conn->error;
}

$conn->close();
