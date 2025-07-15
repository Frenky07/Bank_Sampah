<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$berat = $_POST['berat'];
$tanggal = isset($_POST['Tanggal']) ? $_POST['Tanggal'] : date('Y-m-d');
$id_nasabah = $_POST['id_nasabah']; // ← yang digunakan, bukan nama
$id_jenis = $_POST['id_jenis'];

// Ambil harga per kg dari database berdasarkan id_jenis
$queryHarga = "SELECT harga FROM jenis_sampah WHERE id = '$id_jenis'";
$resultHarga = $conn->query($queryHarga);

if ($resultHarga && $resultHarga->num_rows > 0) {
    $row = $resultHarga->fetch_assoc();
    $harga_per_kg = $row['harga'];
    $total_harga = $berat * $harga_per_kg;

    // Masukkan data ke tabel setoran_sampah
    $sql = "INSERT INTO setoran_sampah (nama, id_nasabah, tanggal, id_jenis, berat, total_harga)
            VALUES ('$nama', '$id_nasabah', '$tanggal', '$id_jenis', '$berat', '$total_harga')";

    if ($conn->query($sql) === TRUE) {
        echo "Data berhasil disimpan!";
        header('Location: ../../Front/HTML/Setoran_Sampah.html');
        exit();
    } else {
        echo "Gagal menyimpan data: " . $conn->error;
    }
} else {
    echo "Gagal mengambil harga dari jenis sampah.";
}

$conn->close();
