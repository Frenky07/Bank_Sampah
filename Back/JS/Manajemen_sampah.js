let currentEditId = null;
let currentNomorWA = null;


document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("dataSampah");
    const filterJenisSelect = document.getElementById("id_jenis");
    const filterBulanSelect = document.getElementById("filter_bulan");
    const filterTahunSelect = document.getElementById("filter_tahun");

    // FUNGSI UNTUK LOAD DATA BERDASARKAN FILTER
    function loadData() {
        const id_jenis = filterJenisSelect.value;
        const bulan = filterBulanSelect.value;
        const tahun = filterTahunSelect.value;

        let url = "../../Back/php/get_data_sampah.php?";
        const params = new URLSearchParams();

        if (id_jenis) params.append("id_jenis", id_jenis);
        if (bulan) params.append("bulan", bulan);
        if (tahun) params.append("tahun", tahun);

        fetch(url + params.toString())
            .then(response => response.json())
            .then(data => {
                tbody.innerHTML = "";
                data.forEach(item => {
                    const tr = document.createElement("tr");

                    tr.innerHTML = `
                        <td>${item.nama}</td>
                        <td>${item.tanggal}</td>
                        <td>${item.nama_jenis}</td>
                        <td>${item.berat}</td>
                        <td>Rp ${parseInt(item.total_harga).toLocaleString()}</td>
                    `;

                    const td = document.createElement("td");

                    const btnEdit = document.createElement("button");
                    btnEdit.textContent = "Edit";
                    btnEdit.className = "btn-Edit";
                    btnEdit.addEventListener("click", () => showEditForm(item));

                    const btnCetak = document.createElement("button");
                    btnCetak.textContent = "Cetak";
                    btnCetak.className = "btn-Cetak";
                    btnCetak.addEventListener("click", () => {
                        showStruk(item);
                        currentNomorWA = item.nomorWA; // simpan sementara
                    });


                    td.appendChild(btnEdit);
                    td.appendChild(btnCetak);
                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
            })
            .catch(error => console.error("Error fetch data:", error));
    }

    // ✅ PASANG EVENT LISTENER SEKALI
    filterJenisSelect.addEventListener("change", loadData);
    filterBulanSelect.addEventListener("change", loadData);
    filterTahunSelect.addEventListener("change", loadData);

    // ✅ FETCH BULAN & TAHUN YANG TERSEDIA
    fetch("../../Back/php/get_tahun_bulan_sampah.php")
        .then(response => response.json())
        .then(data => {
            const bulanMap = {
                "01": "Januari", "02": "Februari", "03": "Maret",
                "04": "April", "05": "Mei", "06": "Juni",
                "07": "Juli", "08": "Agustus", "09": "September",
                "10": "Oktober", "11": "November", "12": "Desember"
            };

            const tahunSet = new Set();
            const bulanSet = new Set();

            data.forEach(row => {
                tahunSet.add(row.tahun);
                bulanSet.add(String(row.bulan).padStart(2, '0'));
            });

            filterTahunSelect.innerHTML = '<option value="">Pilih Tahun</option>';
            Array.from(tahunSet).sort((a, b) => b - a).forEach(tahun => {
                const opt = document.createElement("option");
                opt.value = tahun;
                opt.textContent = tahun;
                filterTahunSelect.appendChild(opt);
            });

            filterBulanSelect.innerHTML = '<option value="">Pilih Bulan</option>';
            Array.from(bulanSet).sort().forEach(bulan => {
                const opt = document.createElement("option");
                opt.value = bulan;
                opt.textContent = bulanMap[bulan] || bulan;
                filterBulanSelect.appendChild(opt);
            });
        });

    // ✅ FETCH DATA PERTAMA KALI
    loadData();

    // CETAK STRUK
    const btnCetak = document.querySelector(".Button-Cetak");
    if (btnCetak) {
        btnCetak.addEventListener("click", function () {
            const strukDiv = document.querySelector(".Struk-Content");

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

    // UBAH HARGA SAAT PILIHAN JENIS SAMPH BERUBAH
    document.getElementById("editJenisSampah").addEventListener("change", function () {
        const harga = getHargaPerJenis(this.value);
        document.getElementById("editHarga").value = harga;
    });
});


// TAMPILKAN FORM EDIT
function showEditForm(data) {
    currentEditId = data.id;
    document.getElementById("editnama").value = data.nama;
    document.getElementById("editTanggal").value = data.tanggal;
    document.getElementById("editJenisSampah").value = data.nama_jenis;
    document.getElementById("editBerat").value = data.berat;
    document.getElementById("editHarga").value = getHargaPerJenis(data.nama_jenis);

    document.querySelector(".Table-Edit").style.display = "flex";
}

function showStruk(data) {
    const hargaPerKg = parseInt(data.harga_per_kg); // ambil dari database
    const total = data.berat * hargaPerKg;

    document.querySelector(".Table-Struk").style.display = "flex";
    document.getElementById("nama").innerText = data.nama;
    document.getElementById("jenis").innerText = data.nama_jenis;
    document.getElementById("berat").innerText = data.berat;
    document.getElementById("harga").innerText = hargaPerKg.toLocaleString();
    document.getElementById("total").innerText = total.toLocaleString();
    document.getElementById("tanggal").innerText = data.tanggal;
}

// FUNGSI HARGA PER JENIS
function getHargaPerJenis(jenis) {
    const hargaMap = {
        Plastic: 2000,
        Kertas: 1000,
        Logam: 4000,
        Kaca: 3000
    };
    return hargaMap[jenis] || 0;
}

// TUTUP FORM EDIT
function Close() {
    document.querySelector(".Table-Edit").style.display = "none";
}

// SIMPAN HASIL EDIT
function editData() {
    const nama = document.getElementById("editnama").value;
    const tanggal = document.getElementById("editTanggal").value;
    const jenis = document.getElementById("editJenisSampah").value;
    const berat = parseFloat(document.getElementById("editBerat").value);
    const harga = parseFloat(document.getElementById("editHarga").value);

    if (!nama || !tanggal || !jenis || isNaN(berat) || isNaN(harga)) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    const total_harga = berat * harga;

    const data = {
        id: currentEditId,
        nama,
        tanggal,
        jenis,
        berat,
        total_harga
    };

    fetch("../../Back/php/update_data_sampah.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.text())
        .then(response => {
            alert(response);
            location.reload();
        })
        .catch(err => console.error("Update error:", err));
}

function kirimStrukWA() {
    const nama = document.getElementById("nama").innerText;
    const jenis = document.getElementById("jenis").innerText;
    const berat = document.getElementById("berat").innerText;
    const harga = document.getElementById("harga").innerText;
    const total = document.getElementById("total").innerText;
    const tanggal = document.getElementById("tanggal").innerText;

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
