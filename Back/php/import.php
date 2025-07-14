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

$path = "C:\xampp\htdocs\Project_KKN\Back\php\DATA PENDUDUK ASEMPAPAK RW 001 (TAHUN 2025).csv";

$csvFile = fopen("data2.csv", "r");

if ($csvFile !== FALSE) {
    fgetcsv($csvFile); // Skip header baris pertama

    while (($data = fgetcsv($csvFile, 1000, ";")) !== FALSE) {
        // Pastikan jumlah kolom sesuai
        if (count($data) === 8) {
            // Bersihkan dan siapkan data
            $nama          = $conn->real_escape_string(trim($data[0]));
            $jenis_kelamin = $conn->real_escape_string(trim($data[1]));
            $tempat_lahir  = $conn->real_escape_string(trim($data[2]));
            $tanggal_lahir = $conn->real_escape_string(trim($data[3]));
            $status        = $conn->real_escape_string(trim($data[4]));
            $hub_keluarga  = $conn->real_escape_string(trim($data[5]));
            $RT            = $conn->real_escape_string(trim($data[6]));
            $RW            = $conn->real_escape_string(trim($data[7]));

            // Insert ke database
            $sql = "INSERT INTO nasabah (nama, jenis_kelamin, tempat_lahir, tanggal_lahir, status, hub_keluarga, RT, RW)
                    VALUES ('$nama', '$jenis_kelamin', '$tempat_lahir', '$tanggal_lahir', '$status', '$hub_keluarga', '$RT', '$RW')";

            if (!$conn->query($sql)) {
                echo "Gagal: " . $conn->error . "<br>";
            }
        } else {
            echo "Baris tidak valid, jumlah kolom tidak sesuai.<br>";
        }
    }

    fclose($csvFile);
    echo "Import selesai.";
} else {
    echo "Gagal membuka file CSV.";
}

$conn->close();
?>
