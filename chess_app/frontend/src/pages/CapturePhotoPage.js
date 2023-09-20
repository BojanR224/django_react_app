import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CameraComponent() {
  // State to store the camera stream
  const [fen, setFen] = useState(null);
  const [stream, setStream] = useState(null);
  // Ref to the video element
  const videoRef = useRef(null);
  // Ref to the canvas element
  const canvasRef = useRef(null);
  const navigate = useNavigate();

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

  const sendImageToAPI = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append("image", imageData);
      const config = {
        headers: {
          accept: "application/json",
          "Content-type": "multipart/form-data; boundary=${formData._boundary}",
        },
      };

      // useEffect(() => {
      //   (async () => {
      //     await axios.post("/api/send-image", formData, config).then((res) => {
      //       setFen(fen, res.data);
      //       console.log(res);
      //     });
      //   })();
      // }, []);

      await axios.post("/api/send-image", formData, config).then((res) => {
        setFen(fen, res.data["fen"]);
        console.log(res);
        console.log(res.data["fen"]);
        navigate("/test", { state: { 'fen': res.data["fen"]} });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    console.log(fen);
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

      const photoURL = canvas.toDataURL();
      sendImageToAPI(photoURL);
      console.log(photoURL);
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
        <button>Analyse Image</button>
      </div>
      <div>
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

export default CameraComponent;
