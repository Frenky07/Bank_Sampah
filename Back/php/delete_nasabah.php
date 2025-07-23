<?php
include 'koneksi.php'; // Pastikan koneksi ini sesuai dengan file koneksi kamu

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;

    if (!$id || !is_numeric($id)) {
        echo "ID nasabah tidak valid.";
        exit;
    }

    // Cek apakah nasabah memiliki tabungan > 0
    $check = $conn->prepare("SELECT total_tabungan FROM nasabah WHERE id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();
    $data = $result->fetch_assoc();

    if (!$data) {
        echo "Nasabah tidak ditemukan.";
        exit;
    }

    if ($data['total_tabungan'] > 0) {
        echo "Nasabah memiliki saldo. Tidak bisa dihapus.";
        exit;
    }

    // Hapus dari tabel nasabah
    $stmt = $conn->prepare("DELETE FROM nasabah WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "Nasabah berhasil dihapus.";
    } else {
        echo "Gagal menghapus nasabah.";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Permintaan tidak valid.";
}
?>
