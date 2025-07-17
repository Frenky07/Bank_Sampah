document.addEventListener("DOMContentLoaded", function () {
    const nasabah = JSON.parse(localStorage.getItem("selectedNasabah"));

    if (!nasabah) {
        alert("Data nasabah tidak ditemukan!");
        return;
    }

    // Tampilkan data di elemen HTML
    document.getElementById("nama").textContent = "Nama: " + nasabah.nama;
    document.getElementById("jumlah-tabungan").textContent = "Jumlah Tabungan: Rp " + parseInt(nasabah.total_tabungan).toLocaleString();

    document.getElementById("btn-kembali").addEventListener("click", function () {
        window.location.href = "nasabah.html"; // Sesuaikan dengan path file aslinya jika perlu
    });

    // Fungsi tampilkan tabel Riwayat Setor
    document.getElementById("btn-setor").addEventListener("click", function () {
        document.getElementById("table-setor").style.display = "table";
        document.getElementById("Table-Tarik").style.display = "none";
    });

    // Fungsi tampilkan tabel Riwayat Tarik
    document.getElementById("btn-Riwayat").addEventListener("click", function () {
        document.getElementById("Table-Tarik").style.display = "table";
        document.getElementById("table-setor").style.display = "none";
    });

    // Jika kamu punya data tambahan seperti TTL, Status, dsb dari database
    // kamu bisa fetch berdasarkan nasabah.id di sini dan tampilkan
});
