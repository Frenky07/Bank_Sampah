<?php
// Pastikan tidak ada output sebelum ini
ob_start(); // Start output buffering

session_start();
include 'koneksi.php'; // sesuaikan dengan nama koneksi database kamu

// Set header JSON di awal
header('Content-Type: application/json');

// Pastikan hanya menerima POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

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

try {
    // Query dengan prepared statement
    $query = "SELECT * FROM akun WHERE nama = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        throw new Exception("Prepare statement gagal: " . $conn->error);
    }
    
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // Cek hasil
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Perbandingan langsung karena password belum di-hash
        if ($password === $user['password']) {
            $_SESSION['akun'] = $user;
            echo json_encode(['status' => 'success', 'message' => 'Login berhasil']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Password salah']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Username tidak ditemukan']);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan server']);
    // Log error untuk debugging (opsional)
    error_log("Login error: " . $e->getMessage());
}

ob_end_flush(); // End output buffering
?>