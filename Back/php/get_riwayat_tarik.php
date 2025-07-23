<?php
header('Content-Type: application/json');
include 'koneksi.php';

$data = [];

if (isset($_GET['nama']) && $_GET['nama'] !== '') {
    $nama = $_GET['nama'];

    $sql = "SELECT p.penarikan, p.tanggal, n.nomorWA 
            FROM penarikan_tabungan p
            JOIN nasabah n ON p.nama = n.nama
            WHERE p.nama = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nama);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $row['nama'] = $nama;
        $data[] = $row;
    }

    $stmt->close();
}

echo json_encode($data);
?>
