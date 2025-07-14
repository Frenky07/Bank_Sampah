<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "banksampah"; // ganti sesuai nama database

$conn = new mysqli($host, $user, $pass, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>