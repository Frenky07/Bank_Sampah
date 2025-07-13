document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname.split("/").pop();
    const links = document.querySelectorAll(".Navbar-Item");

    links.forEach(link => {
        const href = link.getAttribute("href");
        if (href === path) {
            link.classList.add("active-nav");
        }
    });
});
