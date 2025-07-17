document.addEventListener("DOMContentLoaded", function () {
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
