<?php
include 'koneksi.php';

$sql = "SELECT id, nama FROM jenis_sampah";
$result = $conn->query($sql);

while ($row = $result->fetch_assoc()) {
    echo "<option value='" . $row['id'] . "'>" . $row['nama'] . "</option>";
}
?>