document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');

    const loginButton = document.querySelector('.Login_Button');

    loginButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const username = document.getElementById('nama').value.trim();
        const password = document.getElementById('Password').value.trim();

        if (!username || !password) {
            alert('Harap isi username dan password.');
            return;
        }

        try {
            console.log('Mencoba fetch ke:', '../../Back/php/Login_Page.php');
            
            const response = await fetch('../../Back/php/Login_Page.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `nama=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            // Cek apakah response berhasil
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Ambil response sebagai text dulu untuk debugging
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            // Cek apakah response kosong
            if (!responseText.trim()) {
                throw new Error('Response kosong dari server');
            }

            // Coba parse JSON
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                console.error('Response yang tidak bisa di-parse:', responseText);
                throw new Error('Server mengembalikan response yang bukan JSON: ' + responseText.substring(0, 100));
            }

            console.log('Parsed result:', result);

            if (result.status === 'success') {
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'DashBoard.html';
                }, 500);
            } else {
                alert(result.message || 'Login gagal');
            }
        } catch (error) {
            console.error('Error detail:', error);
            alert('Terjadi kesalahan saat login: ' + error.message);
        }
    });
});