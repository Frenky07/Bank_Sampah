let currentEditId = null;
let currentNasabah = null;

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".Navbar-Item");
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active-nav");
        }
        else if (window.location.href.includes(href)) {
            link.classList.add("active-nav");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("tabunganNasabah");
    const saldoFilter = document.getElementById("filterSaldo");
    const searchInput = document.getElementById("searchNama");
    const tarikPopup = document.querySelector(".Table-Tarik");
    const nomorPopup = document.querySelector(".Table-Nomor");
    const btnNomor = document.getElementById("btnEditNomor");
    const btnTarik = document.getElementById("btnTarikSaldo");
    const btnBatal = document.querySelector(".Table-Tarik .Button-Edit:nth-of-type(2)");
    const btnBatal1 = document.getElementById("btnBatal_nomor");

    function loadData() {
        const params = new URLSearchParams();

        if (saldoFilter.value === "ada_saldo") {
            params.append("saldo", "ada");
        }

        const searchValue = searchInput.value.trim();
        if (searchValue) {
            params.append("search", searchValue);
        }

        fetch("../../Back/php/get_nasabah.php?" + params.toString())
            .then(response => response.json())
            .then(data => {
                tbody.innerHTML = "";

                if (!Array.isArray(data) || data.length === 0) {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td colspan="4" style="text-align:center;">Tidak ada data ditemukan</td>`;
                    tbody.appendChild(tr);
                    return;
                }

                data.forEach(item => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${item.nama}</td>
                        <td>Rp ${parseInt(item.total_tabungan).toLocaleString()}</td>
                        <td>${item.nomorWA || "-"}</td>
                    `;
                    const td = document.createElement("td");

                    const btnNomor = document.createElement("button");
                    btnNomor.textContent = "Edit Nomor";
                    btnNomor.className = "btn-Edit";
                    btnNomor.addEventListener("click", () => showNomor(item));

                    const btnEdit = document.createElement("button");
                    btnEdit.textContent = "Riwayat";
                    btnEdit.className = "btn-Edit";
                    btnEdit.addEventListener("click", () => showEditForm(item));

                    const btnTarik = document.createElement("button");
                    btnTarik.textContent = "Tarik";
                    btnTarik.className = "btn-Tarik";
                    btnTarik.addEventListener("click", () => showStruk(item));

                    const btnDelete = document.createElement("button");
                    btnDelete.textContent = "Hapus";
                    btnDelete.className = "btn-Hapus";
                    btnDelete.addEventListener("click", () => deleteNasabah(item.id));

                    td.appendChild(btnNomor);
                    td.appendChild(btnEdit);
                    td.appendChild(btnTarik);
                    td.appendChild(btnDelete);

                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error("Gagal memuat data nasabah:", error);
            });
    }

    function showStrukTarik(data) {
        const strukTarik = document.querySelector(".Table-Struk-Tarik");
        if (!strukTarik) return;

        document.getElementById("nama-Struk-Tarik").innerText = data.nama || (currentNasabah && currentNasabah.nama) || "";
        document.getElementById("total-Struk-Tarik").innerText = parseInt(data.penarikan || 0).toLocaleString();
        document.getElementById("tanggal-Struk-Tarik").innerText = data.tanggal || "";

        strukTarik.style.display = "flex";
    }

    function showEditForm(item) {
        localStorage.setItem("selectedNasabah", JSON.stringify(item));
        window.location.href = "riwayat.html";
    }

    function showNomor(item) {
        nomorPopup.style.display = "flex";
        document.getElementById("editnama_nomor").value = item.nama;
        document.getElementById("tampilnomor").value = item.nomorWA || "";
        document.getElementById("editNomor").value = "";
        currentNasabah = item;
    }

    function close_nomor() {
        nomorPopup.style.display = "none";
    }

    function showStruk(nasabah) {
        currentNasabah = nasabah;
        document.getElementById("editnama").value = nasabah.nama;
        document.getElementById("editTanggal").value = new Date().toISOString().slice(0, 10);
        document.getElementById("editTotal").value = nasabah.total_tabungan;
        document.getElementById("editSaldo").value = "";
        tarikPopup.style.display = "flex";
    }

    function deleteNasabah(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus nasabah ini?")) return;

    const formData = new FormData();
    formData.append("id", id);

    fetch("../../Back/php/delete_nasabah.php", {
        method: "POST",
        body: formData
    })
        .then(res => res.text())
        .then(response => {
            alert(response);
            loadData(); // refresh tabel
        })
        .catch(error => {
            console.error("Gagal menghapus nasabah:", error);
            alert("Terjadi kesalahan saat menghapus nasabah.");
        });
}


    function closePopup() {
        tarikPopup.style.display = "none";
    }

    if (btnNomor) {
        btnNomor.addEventListener("click", function () {
            const nomor = document.getElementById("editNomor").value.trim();
            const nomorBaru = parseInt(nomor, 10);

            if (!nomor) {
                alert("Nomor belum diisi.");
                return;
            }

            if (isNaN(nomorBaru) || nomorBaru <= 0) {
                alert("Masukkan nomor yang valid.");
                return;
            }

            if (!currentNasabah) {
                alert("Nasabah tidak valid.");
                return;
            }

            const formData = new FormData();
            formData.append("id", currentNasabah.id);
            formData.append("nomorWA", nomor);

            fetch("../../Back/php/edit_nomor.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.text())
                .then(response => {
                    alert(response);
                    close_nomor();
                    loadData();
                })
                .catch(error => {
                    console.error("Gagal edit:", error);
                    alert("Gagal melakukan perubahan.");
                });
        });
    }

    if (btnTarik) {
        btnTarik.addEventListener("click", function () {
            const tanggal = document.getElementById("editTanggal").value;
            const jumlahTarik = parseInt(document.getElementById("editSaldo").value, 10);

            if (!tanggal) {
                alert("Tanggal belum dipilih.");
                return;
            }

            if (isNaN(jumlahTarik) || jumlahTarik <= 0) {
                alert("Masukkan jumlah yang valid.");
                return;
            }

            if (!currentNasabah || jumlahTarik > parseInt(currentNasabah.total_tabungan)) {
                alert("Saldo tidak cukup atau nasabah tidak valid.");
                return;
            }

            const formData = new FormData();
            formData.append("nama", currentNasabah.nama);
            formData.append("id_nasabah", currentNasabah.id);
            formData.append("tanggal", tanggal);
            formData.append("penarikan", jumlahTarik);

            fetch("../../Back/php/tarik_saldo.php", {
                method: "POST",
                body: formData
            })
                .then(res => res.text())
                .then(response => {
                    alert(response);
                    closePopup();
                    loadData();
                })
                .catch(error => {
                    console.error("Gagal tarik:", error);
                    alert("Gagal melakukan penarikan.");
                });
        });
    }

    if (btnBatal) {
        btnBatal.addEventListener("click", closePopup);
    }

    if (btnBatal1) {
        btnBatal1.addEventListener("click", close_nomor);
    }

    saldoFilter.addEventListener("change", loadData);
    searchInput.addEventListener("input", loadData);

    loadData();
});
