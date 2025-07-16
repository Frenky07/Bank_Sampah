<?php
include 'koneksi.php';

$data = [];

$result = $conn->query("SELECT id, nama, deskripsi, harga, satuan FROM jenis_sampah");
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "id" => $row["id"],
        "nama" => $row["nama"],
        "deskripsi" => $row["deskripsi"],
        "harga" => $row["harga"],
        "satuan" => $row["satuan"]
    ];
}

header('Content-Type: application/json');
echo json_encode($data);

?>
