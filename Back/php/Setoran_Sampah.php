<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$berat = $_POST['berat'];
$tanggal = isset($_POST['Tanggal']) ? $_POST['Tanggal'] : date('Y-m-d');
$id_nasabah = $_POST['id_nasabah'];
$id_jenis = $_POST['id_jenis'];

// Ambil harga per kg dari jenis sampah
$queryHarga = "SELECT harga FROM jenis_sampah WHERE id = '$id_jenis'";
$resultHarga = $conn->query($queryHarga);

if ($resultHarga && $resultHarga->num_rows > 0) {
    $row = $resultHarga->fetch_assoc();
    $harga_per_kg = $row['harga'];
    $total_harga = $berat * $harga_per_kg;

    // Masukkan ke tabel setoran_sampah
    $sql = "INSERT INTO setoran_sampah (nama, id_nasabah, tanggal, id_jenis, berat, total_harga)
            VALUES ('$nama', '$id_nasabah', '$tanggal', '$id_jenis', '$berat', '$total_harga')";

    if ($conn->query($sql) === TRUE) {
        // Recalculate saldo setelah setor
        $updateSaldo = "
            UPDATE nasabah
            SET total_tabungan = (
                IFNULL((SELECT SUM(total_harga) FROM setoran_sampah WHERE id_nasabah = '$id_nasabah'), 0)
                -
                IFNULL((SELECT SUM(penarikan) FROM penarikan_tabungan WHERE id_nasabah = '$id_nasabah'), 0)
            )
            WHERE id = '$id_nasabah'
        ";

        if ($conn->query($updateSaldo) === TRUE) {
            header('Location: ../../Front/HTML/Setoran_Sampah.html');
            exit();
        } else {
            echo "Gagal update saldo nasabah: " . $conn->error;
        }

    } else {
        echo "Gagal menyimpan data: " . $conn->error;
    }
} else {
    echo "Gagal mengambil harga dari jenis sampah.";
}

$conn->close();
?>