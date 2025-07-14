<?php
include 'koneksi.php';

$data = [];

$result = $conn->query("SELECT id, nama FROM jenis_sampah");
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "id" => $row["id"],
        "nama" => $row["nama"]
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
?>
