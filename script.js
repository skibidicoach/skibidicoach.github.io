document.addEventListener('DOMContentLoaded', (event) => {
    function handleOrientation(event) {
        const gamma = event.gamma; // Rotation around Y axis (-90 to 90)

        // Adjust sensitivity
        const sensitivityFactor = 0.5; // Reduce sensitivity by scaling down the gamma value
        const adjustedGamma = gamma * sensitivityFactor;

        // Apply rotation to the stamp
        const stamp = document.getElementById('stamp');
        stamp.style.transform = `rotate(${adjustedGamma}deg)`;
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

    // Request permission immediately on page load
    requestPermission();

    // Function to update the current time in the #stamp-text element
    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;
        document.getElementById('stamp-text').textContent = currentTime;
    }

    // Function to fade between time and a custom word
    function fadeText() {
        const stampText = document.getElementById('stamp-text');
        const displayWord = 'Balls'; // Replace 'YourWord' with the word you want to display
        let showTime = true;

        setInterval(() => {
            stampText.style.opacity = 0; // Start fade out
            setTimeout(() => {
                stampText.textContent = showTime ? displayWord : getCurrentTime();
                stampText.style.opacity = 1; // Fade in with new content
                showTime = !showTime; // Toggle between time and word
            }, 400); // Wait for fade out to complete before changing text
        }, 2500); // Change text every 2.5 seconds (adjust as needed)
    }

    // Helper function to get current time as a string
    function getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Update the time immediately and then every second
    updateTime();
    // setInterval(updateTime, 1000);

    // Function to update the current date in the #valid-from-text element
    function updateDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = now.toLocaleString('default', { month: 'short' });
        const year = now.getFullYear();
        const currentDate = `${day} ${month} ${year}`;
        document.getElementById('valid-from-text').textContent = `Valid from: 00:00, ${currentDate}`;
    }

    // Update the date immediately
    updateDate();

    // Function to update the remaining time until midnight in the #expires-time element
    function updateTimeUntilMidnight() {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0); // Set the time to midnight

        const diff = midnight - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const remainingTime = `${hours}h : ${minutes}m : ${seconds}s`;
        document.getElementById('expires-time').textContent = remainingTime;
    }

    // Update the remaining time immediately and then every second
    updateTimeUntilMidnight();
    setInterval(updateTimeUntilMidnight, 1000);

    // Start the fade effect for the stamp-text
    fadeText();
});
