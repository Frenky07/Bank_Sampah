<?php
include 'koneksi.php';

$where = [];

if (isset($_GET['saldo']) && $_GET['saldo'] === 'ada') {
    $where[] = "total_tabungan > 0";
}

if (isset($_GET['search']) && $_GET['search'] !== '') {
    $search = $conn->real_escape_string($_GET['search']);
    $where[] = "nama LIKE '%$search%'";
}

$whereClause = "";
if (!empty($where)) {
    $whereClause = "WHERE " . implode(" AND ", $where);
}

$query = "SELECT nama, total_tabungan FROM nasabah $whereClause ORDER BY nama ASC";
$result = $conn->query($query);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
