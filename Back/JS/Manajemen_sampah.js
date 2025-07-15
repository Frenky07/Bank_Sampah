let currentEditId = null;

document.addEventListener("DOMContentLoaded", function () {
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
                    <td>
                        <button onclick='showEditForm(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Edit</button>
                        <button onclick='showStruk(${JSON.stringify(item).replace(/'/g, "&apos;")})'>Cetak</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error fetch data:", error));
});

function showEditForm(data) {
    currentEditId = data.id;
    document.getElementById("editnama").value = data.nama;
    document.getElementById("editTanggal").value = data.tanggal;
    document.getElementById("editJenisSampah").value = data.nama_jenis;
    document.getElementById("editBerat").value = data.berat;

    document.querySelector(".Table-Edit").style.display = "flex";
}

function showStruk(data) {
    document.getElementById("nama").value = data.nama;
    document.getElementById("jenis").value = data.nama_jenis;
    document.getElementById("berat").value = data.berat;
    document.getElementById("tanggal").value = data.tanggal;

    document.querySelector(".Table-Struk").style,display = "flex";
}


function Close() {
    document.querySelector(".Table-Edit").style.display = "none";
}

function editData() {
    const nama = document.getElementById("editnama").value;
    const tanggal = document.getElementById("editTanggal").value;
    const jenis = document.getElementById("editJenisSampah").value;
    const berat = parseFloat(document.getElementById("editBerat").value);

    if (!nama || !tanggal || !jenis || !berat) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    const data = {
        id: currentEditId,
        nama,
        id_nasabah,
        tanggal,
        jenis,
        berat
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
