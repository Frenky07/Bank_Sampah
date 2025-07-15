let currentEditId = null;

document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("tabunganNasabah");
    const saldoFilter = document.getElementById("filterSaldo");
    const searchInput = document.getElementById("searchNama");

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

                if (data.length === 0) {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td colspan="3" style="text-align:center;">Tidak ada data ditemukan</td>`;
                    tbody.appendChild(tr);
                    return;
                }

                data.forEach(item => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${item.nama}</td>
                        <td>Rp ${parseInt(item.total_tabungan).toLocaleString()}</td>
                    `;
                    const td = document.createElement("td");

                    const btnEdit = document.createElement("button");
                    btnEdit.textContent = "Edit";
                    btnEdit.className = "btn-Edit";
                    btnEdit.addEventListener("click", () => showEditForm(item));

                    const btnCetak = document.createElement("button");
                    btnCetak.textContent = "Tarik";
                    btnCetak.className = "btn-Tarik";
                    btnCetak.addEventListener("click", () => showStruk(item));

                    td.appendChild(btnEdit);
                    td.appendChild(btnCetak);

                    tr.appendChild(td);
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error("Gagal memuat data nasabah:", error);
            });
    }

    // Event listeners
    saldoFilter.addEventListener("change", loadData);
    searchInput.addEventListener("input", function () {
        loadData();
    });

    loadData(); // saat halaman pertama kali dimuat
});
