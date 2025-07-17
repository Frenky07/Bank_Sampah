<?php
session_start();
include 'koneksi.php'; // sesuaikan dengan nama koneksi database kamu

// Ambil data dari POST
$username = isset($_POST['nama']) ? trim($_POST['nama']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

// Validasi input
if (empty($username) || empty($password)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username dan password wajib diisi'
    ]);
    exit;
}

// Query dengan prepared statement
$query = "SELECT * FROM akun WHERE nama = ? LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Cek hasil
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // Perbandingan langsung karena password belum di-hash
    if ($password === $user['password']) {
        $_SESSION['akun'] = $user;
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Password salah']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Username tidak ditemukan']);
}
?>
