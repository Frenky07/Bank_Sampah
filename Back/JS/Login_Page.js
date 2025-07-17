document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');

    const loginButton = document.querySelector('.Login_Button');

    loginButton.addEventListener('click', async function (event) {
        event.preventDefault();

        const username = document.getElementById('nama').value.trim();
        const password = document.getElementById('Password').value.trim();

        if (!username || !password) {
            alert('Harap isi username dan password.');
            return; // ⛔ STOP di sini kalau kosong!
        }

        try {
            const response = await fetch('../../Back/PHP/Login_Page.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `nama=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            const result = await response.json();

            if (result.status === 'success') {
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = 'DashBoard.html';
                }, 500);
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Terjadi kesalahan saat login.');
            console.error(error);
        }
    });
});
