<?php
include 'koneksi.php';

$nama = $_POST['nama'];
$tanggal = $_POST['tanggal'];
$penarikan = (int) $_POST['penarikan'];
$id_nasabah = (int) $_POST['id_nasabah'];

if (!$nama || !$tanggal || !$penarikan || !$id_nasabah) {
    echo "Data tidak lengkap!";
    exit;
}

$sql = "INSERT INTO penarikan_tabungan (nama, id_nasabah, tanggal, penarikan) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "Prepare gagal: " . $conn->error;
    exit;
}

$stmt->bind_param("sisi", $nama, $id_nasabah, $tanggal, $penarikan);

if ($stmt->execute()) {
    $updateSaldo = "
        UPDATE nasabah
        SET total_tabungan = (
            IFNULL((SELECT SUM(total_harga) FROM setoran_sampah WHERE id_nasabah = ?), 0)
            -
            IFNULL((SELECT SUM(penarikan) FROM penarikan_tabungan WHERE id_nasabah = ?), 0)
        )
        WHERE id = ?
    ";
    $stmt2 = $conn->prepare($updateSaldo);

    if (!$stmt2) {
        echo "Penarikan berhasil, tapi update saldo gagal: " . $conn->error;
        exit;
    }

    $stmt2->bind_param("iii", $id_nasabah, $id_nasabah, $id_nasabah);

    if ($stmt2->execute()) {
        echo "Penarikan berhasil dan saldo diperbarui.";
    } else {
        echo "Penarikan berhasil, tapi gagal update saldo: " . $stmt2->error;
    }

} else {
    echo "Gagal melakukan penarikan: " . $stmt->error;
}

$conn->close();
?>