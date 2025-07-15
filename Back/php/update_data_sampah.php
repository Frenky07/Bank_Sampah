<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$nama = $data['nama'];
$tanggal = $data['tanggal'];
$jenis = $data['jenis'];
$berat = $data['berat'];

// Ambil harga/kg dan ID jenis dari tabel jenis_sampah
$stmt = $conn->prepare("SELECT harga, id FROM jenis_sampah WHERE nama = ?");
$stmt->bind_param("s", $jenis);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

if (!$result) {
    echo "Jenis sampah tidak valid.";
    exit;
}

$harga_per_kg = $result['harga'];
$id_jenis = $result['id'];
$total_harga = $harga_per_kg * $berat;

// Ambil id_nasabah berdasarkan ID setoran
$stmtNasabah = $conn->prepare("SELECT id_nasabah FROM setoran_sampah WHERE id = ?");
$stmtNasabah->bind_param("i", $id);
$stmtNasabah->execute();
$resNasabah = $stmtNasabah->get_result()->fetch_assoc();

if (!$resNasabah) {
    echo "Gagal mengambil ID nasabah.";
    exit;
}
$id_nasabah = $resNasabah['id_nasabah'];

// Update data setoran
$update = $conn->prepare("UPDATE setoran_sampah SET nama=?, tanggal=?, id_jenis=?, berat=?, total_harga=? WHERE id=?");
$update->bind_param("ssisdi", $nama, $tanggal, $id_jenis, $berat, $total_harga, $id);

if ($update->execute()) {
    // Update ulang total_tabungan
    $updateSaldo = "
        UPDATE nasabah
        SET total_tabungan = (
            IFNULL((SELECT SUM(total_harga) FROM setoran_sampah WHERE id_nasabah = '$id_nasabah'), 0)
            -
            IFNULL((SELECT SUM(penarikan) FROM penarikan_tabungan WHERE id_nasabah = '$id_nasabah'), 0)
        )
        WHERE id = '$id_nasabah'
    ";

    if ($conn->query($updateSaldo) === TRUE) {
        echo "Data berhasil diperbarui dan saldo diperbarui!";
    } else {
        echo "Data diperbarui, tapi gagal update saldo: " . $conn->error;
    }
} else {
    echo "Gagal memperbarui data: " . $conn->error;
}

$conn->close();
?>
