<?php
header('Content-Type: application/json');
include 'koneksi.php';

$data = [];

if (isset($_GET['nama']) && $_GET['nama'] !== '') {
    $nama = $_GET['nama'];

    $sql = "SELECT penarikan, tanggal FROM penarikan_tabungan WHERE nama = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nama);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    $stmt->close();
}

echo json_encode($data);
?>
