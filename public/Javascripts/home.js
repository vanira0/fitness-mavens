const nav = document.querySelector("nav")

window.addEventListener("scroll", function () {
    if (window.pageYOffset > 100) {
        nav.classList.add("bg-dark", "shadow")
    } else {
        nav.classList.remove("bg-dark", "shadow")
    }
})

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        const about = entry.target.querySelector('.about-sec');

        if (entry.isIntersecting) {
            about.classList.add('about-animation');
            return; // if we added the class, exit the function
        }

        // We're not intersecting, so remove the class!
        about.classList.remove('about-animation');
    });
});

observer.observe(document.querySelector('.about-wrapper'));