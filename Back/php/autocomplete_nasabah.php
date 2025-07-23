<?php
include 'koneksi.php';

$search = $_GET['term'];
$result = $conn->query("SELECT id, nama FROM nasabah WHERE nama LIKE '%$search%'");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "label" => $row['nama'],
        "value" => $row['id']
    ];
}

echo json_encode($data);
?>
