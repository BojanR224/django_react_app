import React, { useState, useRef, useEffect } from "react";

function CameraComponent() {
  // State to store the camera stream
  const [stream, setStream] = useState(null);
  // Ref to the video element
  const videoRef = useRef(null);
  // Ref to the canvas element
  const canvasRef = useRef(null);

  // Function to start the camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Function to capture and save a photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoURL = canvas.toDataURL("image/jpeg"); // Convert canvas to base64 image
      // You can now save the photoURL or perform any other action with the captured photo
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <div>
      <h1>Camera Component</h1>
      <div>
        <button onClick={capturePhoto}>Capture Photo</button>
        <button>Analyse Board</button>
      </div>
      <div>
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

export default CameraComponent;
