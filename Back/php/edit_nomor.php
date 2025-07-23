<?php
include 'koneksi.php';

$id = $_POST['id'];
$nomorWA = $_POST['nomorWA'];

$sql = "UPDATE nasabah SET nomorWA='$nomorWA' WHERE id=$id";

if ($conn->query($sql)) {
    echo "success";
} else {
    echo "error";
}