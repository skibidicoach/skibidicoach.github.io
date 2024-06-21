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

    async function startFrontCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(frontCameraConstraints);
            video.srcObject = stream;
            video.play();
        } catch (error) {
            console.error('Error accessing the front camera', error);
        }
    }

    // async function startBackCamera() {
    //     try {
    //         const stream = await navigator.mediaDevices.getUserMedia(backCameraConstraints);
    //         backCameraVideo.srcObject = stream;
    //         backCameraVideo.play();
    //     } catch (error) {
    //         console.error('Error accessing the back camera', error);
    //     }
    // }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await startFrontCamera();
        // await startBackCamera();
    } else {
        console.error('getUserMedia not supported on this browser.');
    }

    photoButton.addEventListener('click', () => {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.pause(); // Pause the video stream to "freeze" the frame
        photoButton.hidden = true;
        sendButton.hidden = false; // Show the send button
    });

    sendButton.addEventListener('click', () => {
        // Here you can implement the logic to send the captured image
        // For example, converting the canvas to a data URL:
        const imageDataUrl = canvas.toDataURL('image/png');
        console.log('Captured image data URL:', imageDataUrl);
        // You can also reset the stream after sending the photo if needed:
        video.play();
        sendButton.hidden = true;
    });
});
