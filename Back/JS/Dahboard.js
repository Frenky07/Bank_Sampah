document.addEventListener("DOMContentLoaded", function () {
    const filterTahunSelect = document.getElementById("filter_tahun");

    function loadData(){
        const tahun = filterTahunSelect.value;

        if (tahun) params.append("tahun", tahun);
    }

    filterTahunSelect.addEventListener("change", loadData);

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

    loadData();

    fetch('../../Back/PHP/get_chart_data.php')
        .then(response => response.json())
        .then(data => {
            const labels = data.map(item => item.jenis);
            const values = data.map(item => item.berat);

            const ctx = document.getElementById('pieChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            '#F5BB00',
                            '#8EA604',
                            '#EC9F05',
                            '#D76A03',
                            '#BF3100',
                            'rgba(255, 159, 64, 0.6)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribusi Sampah Berdasarkan Jenis'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Gagal ambil data:', error));
});
