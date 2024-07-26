
document.addEventListener("DOMContentLoaded", function() {
    // var activeTickets = document.getElementById('active-tickets');
    // var navbar = document.getElementById('navbar');

    // activeTickets.classList.add('visible'); // Ensure it's visible on page load
    // navbar.classList.add('active-0'); // Set initial active state for navbar
    showSection(0);
});

function showSection(n) {
    var sections = document.querySelectorAll('.main-section');
    var navbar = document.getElementById('navbar');
    
    sections.forEach(function(section) {
        // section.classList.remove('visible');
        section.style.display = 'none';
        section.style.zIndex = 1;
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
    activeSection.style.display = 'none';
    activeSection.style.zIndex = 2;
    activeSection.style.display = 'flex';
    // activeSection.style.display = 'flex';
    // void activeSection.offsetWidth;
    // activeSection.classList.add('visible'); 
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

function toggleBadgeOptions(){
    var menu = document.getElementById('overlay-menu');
    var isVisible = menu.classList.contains('visible');

    if (isVisible) {
        menu.classList.remove('visible');
    } else {
        menu.classList.add('visible');
        document.getElementById('input-word').value = localStorage.getItem('word');
        document.getElementById('select-color').value = localStorage.getItem('colour')
    }
}

function submitBadgeOptions(){
    displayWord = document.getElementById('input-word').value;
    color = document.getElementById('select-color').value;
    localStorage.setItem('word', displayWord);
    localStorage.setItem('colour', color);
    updateBadgeColor();
    toggleBadgeOptions();
}

function updateBadgeColor(){
    // var badge = document.getElementById('badge');

    var badgeVideo = document.getElementById('badge-video');
    var source = badgeVideo.getElementsByTagName('source')[0];

    switch (localStorage.getItem('colour')) {
        case 'green':
            // badge.style.backgroundImage = 'url("images/green.jpeg")';
            source.setAttribute('src', 'videos/pink.mp4');
            break;
        case 'blue':
            // badge.style.backgroundImage = 'url("images/blue.png")';
            source.setAttribute('src', 'videos/pink.mp4');
            break;
        case 'pink':
            // badge.style.backgroundImage = 'url("images/pink.png")';
            // badge.style.backgroundImage = 'none';
            // badge.style.background = 'url(videos/pink.mp4)'
            source.setAttribute('src', 'videos/pink.mp4');
            break;
        case 'orange':
            // badge.style.backgroundImage = 'url("images/orange.png")';
            source.setAttribute('src', 'videos/pink.mp4');
            break;
        case 'grey':
            // badge.style.backgroundImage = 'url("images/grey.jpeg")';
            source.setAttribute('src', 'videos/oops.mp4');
            break;
        default:
            break;
    }

    badgeVideo.load();
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

document.addEventListener('DOMContentLoaded', (event) => {
    function handleOrientation(event) {
        const gamma = event.gamma; // Rotation around Y axis (-90 to 90)

        // Adjust sensitivity
        const sensitivityFactor = -0.4; // Reduce sensitivity by scaling down the gamma value
        const adjustedGamma = gamma * sensitivityFactor;

        // Apply rotation to the badge
        const badge = document.getElementById('badge');
        badge.style.transform = `rotate(${adjustedGamma}deg)`;
    }

    function setupOrientationListener() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        } else {
            alert("Device orientation not supported on this device/browser.");
        }
    }

    function requestPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        setupOrientationListener();
                    } else {
                        alert('Permission to access device orientation denied.');
                    }
                })
                .catch(console.error);
        } else {
            setupOrientationListener(); // If not iOS, just set up the listener
        }
    }

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        document.getElementById('badge-text').textContent = currentTime;
    }

    // Function to fade between time and a custom word
    function fadeText() {
        const badgeText = document.getElementById('badge-text');
        let showTime = true;

        setInterval(() => {
            badgeText.style.opacity = 0; // Start fade out
            setTimeout(() => {
                badgeText.textContent = showTime ? localStorage.getItem('word') : getCurrentTime();
                badgeText.style.opacity = 1; // Fade in with new content
                showTime = !showTime; // Toggle between time and word
            }, 400); // Wait for fade out to complete before changing text
        }, 2500); // Change text every 2.5 seconds (adjust as needed)
    }

    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    var minRemaining = 20;
    var secRemaining = 0;
    function updateExpiryTime(){
        secRemaining -= 1;
        if (secRemaining < 0){
            secRemaining = 59;
            minRemaining -= 1;
        }
        if (minRemaining < 0){
            minRemaining = 19;
        }
        const remainingTime = `0h : ${minRemaining}m : ${secRemaining}s`;
        document.getElementById('expires-in-time').textContent = remainingTime;
    }

    updateExpiryTime()
    setInterval(updateExpiryTime, 1000);

    function updateValidFrom() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = now.toLocaleString('default', { month: 'short' });
        const year = now.getFullYear();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentDate = `${day} ${month} ${year}`;
        document.getElementById('valid-from').innerHTML = `Valid from: ${hour}:${minute}, ${currentDate}`;
    }

    updateValidFrom();

    updateTime();
    requestPermission();
    updateBadgeColor();
    fadeText();

});