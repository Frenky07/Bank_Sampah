<?php
include 'koneksi.php';

$id = $_POST['id'];
$deskripsi = $_POST['deskripsi'];
$harga = $_POST['harga'];

$sql = "UPDATE jenis_sampah SET deskripsi='$deskripsi', harga='$harga' WHERE id=$id";

if ($conn->query($sql)) {
    echo "success";
} else {
    echo "error";
}