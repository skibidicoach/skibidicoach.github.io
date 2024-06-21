if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

async function checkCameraPermission() {
    try {
        const result = await navigator.permissions.query({ name: 'camera' });
        if (result.state === 'granted') {
            console.log('Camera permission granted');
            return true;
        } else if (result.state === 'prompt') {
            console.log('Camera permission prompt');
            return false;
        } else if (result.state === 'denied') {
            console.log('Camera permission denied');
            return false;
        }
    } catch (error) {
        console.error('Error checking camera permission', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const frontCameraConstraints = {
        video: {
            facingMode: 'user' // Front camera
        }
    };

    const backCameraConstraints = {
        video: {
            facingMode: { exact: 'environment' } // Back camera
        }
    };

    const video = document.getElementById('camera-stream');
    const backCameraVideo = document.getElementById('back-camera-stream');
    const canvas = document.getElementById('canvas');
    const canvasBack = document.getElementById('canvas-back');
    const photoButton = document.getElementById('photo-button');
    const sendButton = document.getElementById('send-button');
    const countdown = document.getElementById('countdown');
    const closeButton = document.getElementById('close-button');

    let frontCameraStream;
    let backCameraStream;

    async function startFrontCamera() {
        try {
            frontCameraStream = await navigator.mediaDevices.getUserMedia(frontCameraConstraints);
            video.srcObject = frontCameraStream;
            video.play();
        } catch (error) {
            console.error('Error accessing the front camera', error);
        }
    }

    async function startBackCamera() {
        try {
            backCameraStream = await navigator.mediaDevices.getUserMedia(backCameraConstraints);
            backCameraVideo.srcObject = backCameraStream;
            backCameraVideo.play();
        } catch (error) {
            console.error('Error accessing the back camera', error);
        }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const permissionGranted = await checkCameraPermission();
        if (permissionGranted) {
            await startFrontCamera();
        } else {
            try {
                await startFrontCamera();
            } catch (error) {
                console.error('Camera access is needed for this feature.');
            }
        }
    } else {
        console.error('getUserMedia not supported on this browser.');
    }

    photoButton.addEventListener('click', async () => {
        // Capture the current frame from the front camera and draw it on the canvas
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Stop the front camera stream
        frontCameraStream.getTracks().forEach(track => track.stop());
        video.srcObject = null; // Ensure video element is cleared

        // Hide the front camera video element and show the canvas
        video.style.display = 'none';
        canvas.style.display = 'block';
        
        // Start the back camera stream
        backCameraVideo.style.display = 'block';
        photoButton.hidden = true;
        await startBackCamera();

        // Start the 3-second countdown
        let countdownValue = 3;
        countdown.hidden = false;
        countdown.textContent = countdownValue;

        const countdownInterval = setInterval(() => {
            countdownValue -= 1;
            countdown.textContent = countdownValue;
            if (countdownValue <= 0) {
                clearInterval(countdownInterval);
                countdown.hidden = true;

                // Capture the current frame from the back camera and draw it on the canvas
                const contextBack = canvasBack.getContext('2d');
                canvasBack.width = backCameraVideo.videoWidth;
                canvasBack.height = backCameraVideo.videoHeight;
                contextBack.drawImage(backCameraVideo, 0, 0, canvasBack.width, canvasBack.height);

                // Stop the back camera stream
                backCameraStream.getTracks().forEach(track => track.stop());
                backCameraVideo.srcObject = null; // Ensure video element is cleared

                backCameraVideo.style.display = 'none';
                canvasBack.style.display = 'block';

                sendButton.hidden = false;
                closeButton.hidden = false;
            }
        }, 1000);
    });

    sendButton.addEventListener('click', () => {
        // Logic to handle the captured image
        const imageDataUrl = canvas.toDataURL('image/png');
        const imageDataUrlBack = canvasBack.toDataURL('image/png');
        console.log('Captured image data URL:', imageDataUrl);
        console.log('Captured back camera image data URL:', imageDataUrlBack);
        
        // Resume the front camera stream
        canvas.style.display = 'none';
        video.style.display = 'block';
        startFrontCamera();
        sendButton.hidden = true;
        photoButton.hidden = false;
    });

    closeButton.addEventListener('click', async () => {
        canvas.style.display = 'none';
        canvasBack.style.display = 'none';
        video.style.display = 'block';
        backCameraVideo.display = 'none';
        closeButton.hidden = true;
        sendButton.hidden = true;
        photoButton.hidden = false
        await startFrontCamera();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot');
    const welcome = document.getElementById('welcome');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Remove active and selected classes from all dots
            dots.forEach(d => {
                d.classList.remove('active-dot');
                d.classList.remove('selected-dot');
            });

            // Add active class to all previous dots
            for (let i = 0; i < index; i++) {
                dots[i].classList.add('active-dot');
            }

            // Add selected class to the clicked dot
            dot.classList.add('selected-dot');

            // Fade out the #welcome div after 1 second
            setTimeout(() => {
                welcome.classList.add('fade-out');
            }, 1000);
        });
    });
});
