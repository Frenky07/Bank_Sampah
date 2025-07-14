// Saat halaman pertama kali dimuat, tambahkan kelas fade-in
window.addEventListener('load', () => {
    document.body.classList.add('fade-in');
});

// Saat tombol login diklik, lakukan animasi fade-out dan redirect
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.Login_Button');
    if (loginButton) {
        loginButton.addEventListener('click', function (event) {
            event.preventDefault(); // Cegah redirect langsung

            document.body.classList.remove('fade-in');
            document.body.classList.add('fade-out');

            setTimeout(() => {
                window.location.href = 'DashBoard.html';
            }, 500); // Waktu sesuai animasi CSS
        });
    }
});
