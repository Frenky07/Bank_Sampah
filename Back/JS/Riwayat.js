document.addEventListener("DOMContentLoaded", function () {
    fetch("../../Back/php/get_all_nasabah.php")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("tabunganNasabah");
            tbody.innerHTML = "";
            data.forEach(nasabah => {
                // buat baris HTML
            });
        });

    const btnKirimWATarik = document.getElementById("btn-kirim-wa-tarik");
    if (btnKirimWATarik) {
        btnKirimWATarik.addEventListener("click", kirimStrukWATarik);
    }


    const nasabah = JSON.parse(localStorage.getItem("selectedNasabah"));

    if (!nasabah) {
        alert("Data nasabah tidak ditemukan!");
        return;
    }

    // Tampilkan data di elemen HTML
    document.getElementById("nama").textContent = "Nama: " + nasabah.nama;
    document.getElementById("jumlah-tabungan").textContent = "Jumlah Tabungan: Rp " + parseInt(nasabah.total_tabungan).toLocaleString();

    document.getElementById("btn-kembali").addEventListener("click", function () {
        localStorage.removeItem("selectedNasabah"); 
        window.location.href = "Nasabah.html";
    });

    document.getElementById("btn-Riwayat").addEventListener("click", function () {
        document.getElementById("Table-Tarik").style.display = "table";
        document.getElementById("table-setor").style.display = "none";

        fetch(`../../Back/PHP/get_riwayat_tarik.php?nama=${encodeURIComponent(nasabah.nama)}`)
            .then((res) => res.json())
            .then((data) => {
                const tbody = document.querySelector("#Table-Tarik tbody");
                tbody.innerHTML = "";

                if (data.length === 0) {
                    const row = document.createElement("tr");
                    const cell = document.createElement("td");
                    cell.setAttribute("colspan", 3);
                    cell.textContent = "Belum ada penarikan";
                    row.appendChild(cell);
                    tbody.appendChild(row);
                    return;
                }

                data.forEach((item) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>Rp ${parseInt(item.penarikan).toLocaleString()}</td>
                    <td>${item.tanggal}</td>
                `;

                    const td = document.createElement("td");
                    const btnCetakTarik = document.createElement("button");
                    btnCetakTarik.textContent = "Cetak";
                    btnCetakTarik.className = "btn-Cetak-Tarik";
                    btnCetakTarik.addEventListener("click", () => {
                        showStrukTarik(item);
                        currentNomorWA = item.nomorWA || ""; // simpan sementara dengan fallback
                    });

                    td.appendChild(btnCetakTarik);
                    row.appendChild(td);
                    tbody.appendChild(row);
                });
            })
            .catch((err) => {
                console.error("Gagal mengambil data penarikan:", err);
            });
    });

    // Event listener untuk tombol cetak struk (yang sudah ada di HTML)
    const btnCetakTarik = document.querySelector(".Button-Cetak-Tarik");
    if (btnCetakTarik) {
        btnCetakTarik.addEventListener("click", function () {
            const strukDiv = document.querySelector(".Struk-Content-Tarik");

            const printWindow = window.open("", "_blank", "width=400,height=600");
            printWindow.document.write(`
                <html>
                <head>
                    <title>Struk Bank Sampah</title>
                    <style>
                        body {
                            font-family: Poppins, sans-serif;
                            padding: 20px;
                        }
                        .Table-Struk-in {
                            text-align: center;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    ${strukDiv.innerHTML}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        });
    }

    function showStruk(data) {
        console.log("Menampilkan struk untuk:", data);

        // Validasi data yang masuk
        if (!data) {
            console.error("Data struk tidak valid!");
            return;
        }

        // Pastikan elemen struk ada sebelum menampilkan
        const strukTable = document.querySelector(".Table-Struk");
        if (!strukTable) {
            console.error("Elemen .Table-Struk tidak ditemukan di HTML!");
            alert("Komponen struk tidak ditemukan! Periksa HTML Anda.");
            return;
        }

        // Hitung total harga
        const hargaPerKg = parseInt(data.harga_per_kg) || 0;
        const berat = parseFloat(data.berat) || 0;
        const total = berat * hargaPerKg;

        // Tampilkan modal/struk
        strukTable.style.display = "flex";

        // Pastikan semua elemen ada sebelum mengisi data
        const elementsToFill = [
            { id: "nama-Struk", value: data.nama || "Tidak tersedia" },
            { id: "jenis-Struk", value: data.nama_jenis || "Tidak tersedia" },
            { id: "berat-Struk", value: berat.toString() },
            { id: "harga-Struk", value: hargaPerKg.toLocaleString() },
            { id: "total-Struk", value: total.toLocaleString() },
            { id: "tanggal-Struk", value: data.tanggal || "Tidak tersedia" }
        ];

        elementsToFill.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.innerText = item.value;
            } else {
                console.error(`Elemen dengan ID ${item.id} tidak ditemukan di HTML!`);
            }
        });
    }

    function showStrukTarik(data) {
    console.log("Menampilkan struk untuk:", data);

    if (!data) {
        console.error("Data struk tidak valid!");
        return;
    }

    const strukTableTarik = document.querySelector(".Table-Struk-Tarik");
    if (!strukTableTarik) {
        alert("Komponen struk tidak ditemukan! Periksa HTML Anda.");
        return;
    }

    strukTableTarik.style.display = "flex";

    const elementsToFill = [
        { id: "nama-Struk-tarik", value: data.nama || "Tidak tersedia" },
        { id: "total-tarik-saldo", value: `Rp ${parseInt(data.penarikan).toLocaleString()}` },
        { id: "tanggal-Struk-tarik", value: data.tanggal || "Tidak tersedia" }
    ];

    elementsToFill.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            element.innerText = item.value;
        }
    });

    // ✅ Simpan nomor WA nasabah
    currentNomorWA = data.nomorWA || "";
}



    function kirimStrukWA() {
        // Ambil data dari elemen yang sudah diisi
        const namaEl = document.getElementById("nama-Struk");
        const jenisEl = document.getElementById("jenis-Struk");
        const beratEl = document.getElementById("berat-Struk");
        const hargaEl = document.getElementById("harga-Struk");
        const totalEl = document.getElementById("total-Struk");
        const tanggalEl = document.getElementById("tanggal-Struk");

        if (!namaEl || !jenisEl || !beratEl || !hargaEl || !totalEl || !tanggalEl) {
            console.error("Beberapa elemen struk tidak ditemukan!");
            return;
        }

        const nama = namaEl.innerText;
        const jenis = jenisEl.innerText;
        const berat = beratEl.innerText;
        const harga = hargaEl.innerText;
        const total = totalEl.innerText;
        const tanggal = tanggalEl.innerText;

        const strukText =
            `*Struk Setor Bank Sampah Desa*
====================================
*Nama:* ${nama}
*Tanggal:* ${tanggal}
*Jenis Sampah:* ${jenis}
*Berat:* ${berat} Kg
*Harga/kg:* Rp ${harga}
*Total:* Rp ${total}
====================================
Terima kasih telah berpartisipasi menjaga lingkungan`;

        // Jika nomor sudah ada
        if (currentNomorWA && currentNomorWA.trim() !== "") {
            const urlWA = `https://wa.me/${currentNomorWA}?text=${encodeURIComponent(strukText)}`;
            window.open(urlWA, '_blank');
            return;
        }

        // Jika belum ada, minta input & simpan ke database
        const inputWA = prompt("Nomor WhatsApp belum tersedia. Masukkan nomor (cth: 6281234567890):");
        if (!inputWA) return;

        // Simpan ke database
        fetch("../../Back/php/update_nomor_wa.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama, nomorWA: inputWA })
        })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                const urlWA = `https://wa.me/${inputWA}?text=${encodeURIComponent(strukText)}`;
                window.open(urlWA, '_blank');
            })
            .catch(err => {
                alert("Gagal simpan nomor WA!");
                console.error(err);
            });
    }

    function kirimStrukWATarik() {
        // Ambil data dari elemen yang sudah diisi
        const namaElTarik = document.getElementById("nama-Struk-tarik");
        const totalElTarik = document.getElementById("total-tarik-saldo");
        const tanggalElTarik = document.getElementById("tanggal-Struk-tarik");

        if (!namaElTarik || !totalElTarik || !tanggalElTarik) {
            console.error("Beberapa elemen struk tidak ditemukan!");
            return;
        }

        const namatarik = namaElTarik.innerText.replace("Nama: ", "").trim();
        const totaltarik = totalElTarik.innerText.replace("Rp ", "").trim();
        const tanggaltarik = tanggalElTarik.innerText.replace("Tanggal: ", "").trim();

        const strukTexttarik =
            `*Struk Penarikan Bank Sampah Desa*
==============================
*Nama:* ${namatarik}
*Tanggal:* ${tanggaltarik}
*Jumlah Penarikan:* Rp ${totaltarik}
==============================
Terima kasih telah berpartisipasi menjaga lingkungan 🌱`;

        // Jika nomor WA sudah ada
        if (currentNomorWA && currentNomorWA.trim() !== "") {
            const urlWA = `https://wa.me/${currentNomorWA}?text=${encodeURIComponent(strukTexttarik)}`;
            window.open(urlWA, '_blank');
            return;
        }

        // Jika belum ada, minta input & simpan ke database
        const inputWA = prompt("Nomor WhatsApp belum tersedia. Masukkan nomor (cth: 6281234567890):");
        if (!inputWA) return;

        // Simpan ke database
        fetch("../../Back/php/update_nomor_wa.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nama: namatarik, nomorWA: inputWA })
        })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                const urlWA = `https://wa.me/${inputWA}?text=${encodeURIComponent(strukTexttarik)}`;
                window.open(urlWA, '_blank');
            })
            .catch(err => {
                alert("Gagal menyimpan nomor WA!");
                console.error(err);
            });
    }


    // Fungsi tampilkan tabel Riwayat Setor
    document.getElementById("btn-setor").addEventListener("click", function () {
        document.getElementById("table-setor").style.display = "table";
        document.getElementById("Table-Tarik").style.display = "none";

        fetch(`../../Back/php/get_data_sampah.php?nama_nasabah=${encodeURIComponent(nasabah.nama)}`)
            .then((res) => res.json())
            .then((data) => {
                const tbody = document.querySelector("#table-setor tbody");
                tbody.innerHTML = "";

                if (data.length === 0) {
                    const row = document.createElement("tr");
                    const cell = document.createElement("td");
                    cell.setAttribute("colspan", 5);
                    cell.textContent = "Belum ada setoran";
                    row.appendChild(cell);
                    tbody.appendChild(row);
                    return;
                }

                data.forEach((item) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                    <td>${item.nama_jenis}</td>
                    <td>${item.berat} kg</td>
                    <td>Rp ${parseInt(item.total_harga).toLocaleString()}</td>
                    <td>${item.tanggal}</td>
                `;

                    // Buat tombol cetak untuk setiap row
                    const tdCetak = document.createElement("td");
                    const btnCetak = document.createElement("button");
                    btnCetak.textContent = "Cetak";
                    btnCetak.className = "btn-cetak";

                    // Event listener untuk tombol cetak di tabel setor
                    btnCetak.addEventListener("click", () => {
                        showStruk(item);
                        currentNomorWA = item.nomorWA || ""; // jika ada
                    });

                    tdCetak.appendChild(btnCetak);
                    row.appendChild(tdCetak);
                    tbody.appendChild(row);
                });
            })
            .catch((err) => {
                console.error("Gagal mengambil data setoran:", err);
            });
    });

    // Event listener untuk tombol Kirim WA (menggunakan ID)
    const btnKirimWA = document.getElementById("btn-kirim-wa");
    if (btnKirimWA) {
        btnKirimWA.addEventListener("click", kirimStrukWA);
    }

    // Event listener untuk tombol tutup struk (menggunakan ID)
    const btnTutupStruk = document.getElementById("btn-tutup-struk");
    if (btnTutupStruk) {
        btnTutupStruk.addEventListener("click", function () {
            const strukTable = document.querySelector(".Table-Struk");
            if (strukTable) {
                strukTable.style.display = "none";
            }
        });
    }

    // Variabel global untuk menyimpan nomor WA sementara
    let currentNomorWA = "";

    // Load default tab
    document.getElementById("btn-setor").click();
});