let currentEditId = null;

document.addEventListener("DOMContentLoaded", function () {
    // FETCH & TAMPILKAN DATA DARI DATABASE
    fetch("../../Back/php/get_data_sampah.php")
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("dataSampah");
            data.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item.nama}</td>
                    <td>${item.tanggal}</td>
                    <td>${item.nama_jenis}</td>
                    <td>${item.berat}</td>
                    <td>Rp ${parseInt(item.total_harga).toLocaleString()}</td>
                    <td>
                        <button onclick='showEditForm(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Edit</button>
                        <button onclick='showStruk(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Cetak</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error fetch data:", error));

    // CETAK STRUK
    const btnCetak = document.querySelector(".Button-Cetak");
    if (btnCetak) {
        btnCetak.addEventListener("click", function () {
            const strukDiv = document.querySelector(".Table-Struk-Content");

            const printWindow = window.open("", "_blank", "width=400,height=600");
            printWindow.document.write(`
                <html>
                <head>
                    <title>Struk Bank Sampah</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
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

    // UBAH HARGA OTOMATIS SAAT PILIHAN JENIS BERUBAH
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
    // document.getElementById("editIdNasabah").value = data.id_nasabah;

    document.querySelector(".Table-Edit").style.display = "flex";
}

// CETAK STRUK
function showStruk(data) {
    const hargaPerKg = getHargaPerJenis(data.nama_jenis);
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
    const id_nasabah = parseInt(document.getElementById("editIdNasabah").value);

    if (!nama || !tanggal || !jenis || isNaN(berat) || isNaN(harga) || isNaN(id_nasabah)) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    const total_harga = berat * harga;

    const data = {
        id: currentEditId,
        nama,
        id_nasabah,
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
