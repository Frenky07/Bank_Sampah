<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$nama = $conn->real_escape_string($data["nama"]);
$nomorWA = $conn->real_escape_string($data["nomorWA"]);

$sql = "UPDATE nasabah SET nomorWA = '$nomorWA' WHERE nama = '$nama'";

if ($conn->query($sql)) {
    echo "Nomor WhatsApp berhasil disimpan!";
} else {
    echo "Gagal menyimpan nomor WhatsApp.";
}