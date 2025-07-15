<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$harga = $data['harga'];

$stmt = $conn->prepare("UPDATE jenis_sampah SET harga = ? WHERE id = ?");
$stmt->bind_param("di", $harga, $id);

if ($stmt->execute()) {
    echo "Harga berhasil diperbarui.";
} else {
    echo "Gagal memperbarui harga.";
}

?>