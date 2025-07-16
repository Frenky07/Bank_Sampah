document.addEventListener("DOMContentLoaded", function () {
    const bulanSelect = document.getElementById("filterBulan");
    const tahunSelect = document.getElementById("filterTahun");
    const summaryList = document.getElementById("summary-list");
    const chartCanvas = document.getElementById("pieChart");
    let chart = null; // Global chart instance

    // 1. Label bulan
    const bulanLabel = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // 2. Buat dropdown bulan
    for (let i = 1; i <= 12; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = bulanLabel[i];
        bulanSelect.appendChild(opt);
    }

    // 3. Buat dropdown tahun (5 tahun terakhir)
    const tahunSekarang = new Date().getFullYear();
    for (let i = tahunSekarang; i >= tahunSekarang - 5; i--) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        tahunSelect.appendChild(opt);
    }

    // 4. Set nilai default (bulan & tahun sekarang)
    bulanSelect.value = new Date().getMonth() + 1;
    tahunSelect.value = tahunSekarang;

    // 5. Event listener saat dropdown berubah
    bulanSelect.addEventListener("change", fetchData);
    tahunSelect.addEventListener("change", fetchData);

    // 6. Ambil dan tampilkan data awal
    fetchData();

    // 7. Fetch data dari PHP
    function fetchData() {
        const bulan = bulanSelect.value;
        const tahun = tahunSelect.value;

        fetch(`../../Back/php/get_data_sampah.php?bulan=${bulan}&tahun=${tahun}`)
            .then(res => res.json())
            .then(data => {
                console.log("Data diterima:", data); // Debug

                if (!data || data.length === 0) {
                    summaryList.innerHTML = "<p style='color:red;'>Tidak ada data ditemukan.</p>";
                    if (chart) chart.destroy();
                    return;
                }

                const summary = {};

                data.forEach(item => {
                    const jenis = item.nama_jenis;
                    if (!summary[jenis]) {
                        summary[jenis] = { berat: 0, harga: 0 };
                    }
                    summary[jenis].berat += parseFloat(item.berat);
                    summary[jenis].harga += parseFloat(item.total_harga);
                });

                renderSummary(summary);
                renderChart(summary);
            })
            .catch(err => {
                console.error("Gagal fetch data:", err);
                summaryList.innerHTML = "<p style='color:red;'>Gagal memuat data.</p>";
            });
    }

    // 8. Tampilkan ringkasan dalam tabel
    function renderSummary(summary) {
        let html = `<table style="width:100%; border-collapse: collapse;">
                      <thead>
                        <tr style="background:#1D7171; color:white;">
                            <th style="padding:10px;">Jenis Sampah</th>
                            <th style="padding:10px;">Total Berat (kg)</th>
                            <th style="padding:10px;">Total Harga (Rp)</th>
                        </tr>
                      </thead>
                      <tbody>`;

        for (let jenis in summary) {
            html += `
                <tr style="text-align:center;">
                    <td style="padding:10px;">${jenis}</td>
                    <td>${summary[jenis].berat.toFixed(2)}</td>
                    <td>Rp ${summary[jenis].harga.toLocaleString()}</td>
                </tr>`;
        }

        html += `</tbody></table>`;
        summaryList.innerHTML = html;
    }

    // 9. Tampilkan pie chart menggunakan Chart.js
    function renderChart(summary) {
        if (!chartCanvas) return;

        const labels = Object.keys(summary);
        const dataBerat = labels.map(jenis => summary[jenis].berat);

        const ctx = chartCanvas.getContext("2d");

        if (chart) chart.destroy();

        chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    label: "Distribusi Berat Sampah",
                    data: dataBerat,
                    backgroundColor: [
                        "#FF6384", "#36A2EB", "#FFCE56", "#9DC139", "#1D7171",
                        "#9966FF", "#FF9F40", "#E7E9ED", "#4BC0C0", "#F7464A"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
    }
});