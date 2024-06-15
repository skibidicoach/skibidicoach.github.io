document.addEventListener("DOMContentLoaded", function() {
    var activeTickets = document.getElementById('active-tickets');
    var navbar = document.getElementById('navbar');

    activeTickets.classList.add('visible'); // Ensure it's visible on page load
    navbar.classList.add('active-0'); // Set initial active state for navbar
});

function showSection(n) {
    var sections = document.querySelectorAll('.main-section');
    var navbar = document.getElementById('navbar');
    
    sections.forEach(function(section) {
        section.classList.remove('visible');
        section.style.display = 'none';
    });

    var activeSection;
    switch (n) {
        case 0:
            activeSection = document.getElementById('active-tickets');
            break;
        case 1:
            activeSection = document.getElementById('my-tickets');
            break;
        default:
            activeSection = document.getElementById('buy-tickets');
            break;
    }

    activeSection.style.display = 'flex';
    void activeSection.offsetWidth;
    activeSection.classList.add('visible'); 
    navbar.className = 'active-' + n;
}

function toggleSideMenu() {
    var sideMenuBackground = document.getElementById('side-menu-background');
    var sideMenu = document.getElementById('side-menu');

    var isVisible = sideMenu.classList.contains('visible');
    
    if (isVisible) {
        sideMenuBackground.classList.remove('visible');
        sideMenu.classList.remove('visible');
    } else {
        sideMenuBackground.classList.add('visible');
        sideMenu.classList.add('visible');
    }
}

function changeProfileName(){
    let userInput = prompt("Please enter your name:");

    if (userInput) {
        document.getElementById('profile-name').innerText = userInput;
        localStorage.setItem('profileName', userInput);
    }

}

function loadProfileName() {
    let storedName = localStorage.getItem('profileName');
    if (storedName) {
        document.getElementById('profile-name').innerText = storedName;
    }
}

window.onload = function() {
    loadProfileName();
}