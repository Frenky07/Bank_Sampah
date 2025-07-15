document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("datamarket");
    const selectJenis = document.getElementById("editJenisSampah");
    const inputHarga = document.getElementById("editHarga");

    // 1. ISI SELECT DROPDOWN
    fetch("../../Back/php/get_jenis_sampah_json.php")
        .then(res => res.json())
        .then(data => {
            selectJenis.innerHTML = '<option value="">Pilih Jenis Sampah</option>';
            data.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item.id;
                opt.textContent = item.nama;
                selectJenis.appendChild(opt);
            });
        });

    // 2. TAMPILKAN DATA KE TABEL
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

    // 3. KETIKA PILIH JENIS DI DROPDOWN
    selectJenis.addEventListener("change", function () {
        const id = this.value;
        if (!id) return;

        fetch(`../../Back/php/get_jenis_sampah_by_id.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                inputHarga.value = data.harga;
            });
    });

    // 4. FUNGSI UNTUK TOMBOL EDIT
    window.editHarga = function (id) {
        selectJenis.value = id;
        fetch(`../../Back/php/get_jenis_sampah_by_id.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                inputHarga.value = data.harga;
                inputHarga.focus();
            });
    };

    // 5. SIMPAN PERUBAHAN HARGA
    inputHarga.addEventListener("change", function () {
        const id = selectJenis.value;
        const harga = parseFloat(inputHarga.value);

        if (!id || isNaN(harga)) return;

        fetch("../../Back/php/update_harga_sampah.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, harga })
        })
            .then(res => res.text())
            .then(msg => {
                alert(msg);
                loadTable();
            });
    });
});
