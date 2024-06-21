if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
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
    const photoButton = document.getElementById('photo-button');
    const sendButton = document.getElementById('send-button');
    const countdown = document.getElementById('countdown');

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
        await startFrontCamera();
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
        backCameraVideo.hidden = false;
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

                canvas.width = backCameraVideo.videoWidth;
                canvas.height = backCameraVideo.videoHeight;
                context.drawImage(backCameraVideo, 0, 0, canvas.width, canvas.height);

                // Stop the back camera stream
                backCameraStream.getTracks().forEach(track => track.stop());
                backCameraVideo.srcObject = null; // Ensure video element is cleared

                sendButton.hidden = false;
            }
        }, 1000);
    });

    sendButton.addEventListener('click', () => {
        // Logic to handle the captured image
        const imageDataUrl = canvas.toDataURL('image/png');
        console.log('Captured image data URL:', imageDataUrl);
        
        // Resume the front camera stream
        canvas.style.display = 'none';
        video.style.display = 'block';
        startFrontCamera();
        sendButton.hidden = true;
        photoButton.hidden = false;
    });
});
