document.addEventListener("DOMContentLoaded", function () {
    fetch("../../Back/php/get_all_nasabah.php")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("tabunganNasabah");
            tbody.innerHTML = "";
            data.forEach(nasabah => {
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
                        currentNomorWA = item.nomorWA || "";
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

        if (!data) {
            console.error("Data struk tidak valid!");
            return;
        }

        const strukTable = document.querySelector(".Table-Struk");
        if (!strukTable) {
            console.error("Elemen .Table-Struk tidak ditemukan di HTML!");
            alert("Komponen struk tidak ditemukan! Periksa HTML Anda.");
            return;
        }

        const hargaPerKg = parseInt(data.harga_per_kg) || 0;
        const berat = parseFloat(data.berat) || 0;
        const total = berat * hargaPerKg;

        strukTable.style.display = "flex";

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
        currentNomorWA = data.nomorWA || "";
    }

    function kirimStrukWA() {
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

        if (currentNomorWA && currentNomorWA.trim() !== "") {
            const urlWA = `https://wa.me/${currentNomorWA}?text=${encodeURIComponent(strukText)}`;
            window.open(urlWA, '_blank');
            return;
        }

        const inputWA = prompt("Nomor WhatsApp belum tersedia. Masukkan nomor (cth: 6281234567890):");
        if (!inputWA) return;

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

        if (currentNomorWA && currentNomorWA.trim() !== "") {
            const urlWA = `https://wa.me/${currentNomorWA}?text=${encodeURIComponent(strukTexttarik)}`;
            window.open(urlWA, '_blank');
            return;
        }

        const inputWA = prompt("Nomor WhatsApp belum tersedia. Masukkan nomor (cth: 6281234567890):");
        if (!inputWA) return;

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

                    const tdCetak = document.createElement("td");
                    const btnCetak = document.createElement("button");
                    btnCetak.textContent = "Cetak";
                    btnCetak.className = "btn-cetak";

                    btnCetak.addEventListener("click", () => {
                        showStruk(item);
                        currentNomorWA = item.nomorWA || "";
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

    const btnKirimWA = document.getElementById("btn-kirim-wa");
    if (btnKirimWA) {
        btnKirimWA.addEventListener("click", kirimStrukWA);
    }

    const btnTutupStruk = document.getElementById("btn-tutup-struk");
    if (btnTutupStruk) {
        btnTutupStruk.addEventListener("click", function () {
            const strukTable = document.querySelector(".Table-Struk");
            if (strukTable) {
                strukTable.style.display = "none";
            }
        });
    }

    let currentNomorWA = "";

    document.getElementById("btn-setor").click();
});