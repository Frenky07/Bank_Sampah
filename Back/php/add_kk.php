<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$jenis_kelamin = $_POST['jenis_kelamin'] == "Laki-laki" ? "Lk" : "Pr";
$tempat_lahir = $_POST['tempat_lahir'];
$tanggal_lahir = $_POST['tanggal_lahir'];
$status = $_POST['status'];
$hub_keluarga = $_POST['hub_keluarga'];
$RT = $_POST['RT'];
$RW = $_POST['RW'];
$nomorWA = $_POST['nomor_wa'];
$total_tabungan = 0;

$sql = "INSERT INTO nasabah (nama, jenis_kelamin, tempat_lahir, tanggal_lahir, status, hub_keluarga, RT, RW, total_tabungan, nomorWA) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssss", $nama, $jenis_kelamin, $tempat_lahir, $tanggal_lahir, $status, $hub_keluarga, $RT, $RW, $total_tabungan, $nomorWA);

if ($stmt->execute()) {
    echo "<script>
        alert('Data berhasil ditambahkan!');
        window.location.href = '../../Front/html/Setoran_Sampah.html';
    </script>";
} else {
    echo "Gagal menambahkan data: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
