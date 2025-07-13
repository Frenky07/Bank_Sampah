<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$nik = $_POST['nik'];
$jenis = $_POST['jenis_sampah'];
$berat = $_POST['berat'];
$total = $_POST[$berat*2000];
$tanggal_default = date('Y-m-d');

$sql = "INSERT INTO setoran_sampah (nama, nik, jenis_sampah, berat, total_harga, tanggal)
        VALUES ('$nama', '$nik', '$jenis', '$berat', '$total', '$tanggal_default')";

if ($conn->query($sql) === TRUE) {
    echo "Data berhasil disimpan!";
    header('Location: ../../Front/HTML/Setoran_Sampah.html');
    exit();
} else {
    echo "Gagal menyimpan data: " . $conn->error;
}

$conn->close();
?>
