let currentEditId = null;

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("datamarket");
    const inputNama = document.getElementById("editnama");
    const inputDeskripsi = document.getElementById("editdeskripsi");
    const inputHarga = document.getElementById("editHarga");

    function loadTable() {
        fetch("../../Back/php/get_jenis_sampah_json.php")
            .then(res => res.json())
            .then(data => {
                tbody.innerHTML = "";
                data.forEach(item => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${item.nama}</td>
                        <td>${item.deskripsi}</td>
                        <td>Rp ${parseInt(item.harga).toLocaleString()} / ${item.satuan}</td>
                        <td>
                            <button class="btn-edit" onclick="editHarga(${item.id})">Edit</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            });
    }

    loadTable();
});

function editHarga(id) {
    // Ambil data dari database berdasarkan id
    fetch(`../../Back/php/get_jenis_sampah_by_id.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            document.querySelector(".Table-edit-harga").style.display = "flex";
            document.getElementById("editnama").value = data.nama;
            document.getElementById("editdeskripsi").value = data.deskripsi;
            document.getElementById("editHarga").value = data.harga;
            currentEditId = id;
        });
}

function editData() {
    const deskripsi = document.getElementById("editdeskripsi").value;
    const harga = document.getElementById("editHarga").value;

    fetch("../../Back/php/update_jenis_sampah.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `id=${currentEditId}&deskripsi=${encodeURIComponent(deskripsi)}&harga=${encodeURIComponent(harga)}`
    })
    .then(res => res.text())
    .then(response => {
        if (response === "success") {
            alert("Data berhasil diupdate!");
            document.querySelector(".Table-edit-harga").style.display = "none";
            currentEditId = null;
            // Reload data tabel
            document.dispatchEvent(new Event("DOMContentLoaded"));
        } else {
            alert("Gagal mengupdate data.");
        }
    });
}

function Close() {
    document.querySelector(".Table-edit-harga").style.display = "none";
}
