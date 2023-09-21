import React, { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

function CameraComponent() {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoURL = canvas.toDataURL();
      navigate("/loading", { state: { image: photoURL } });
    }
  };

  useEffect(() => {
    startCamera();
  }, []);

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Grid item xs={12} align="center">
        <video className="camera" ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </Grid>
      <Grid item xs={12} align="center">
        <Button onClick={capturePhoto}>Capture Photo</Button>
      </Grid>
    </Grid>
  );
}

export default CameraComponent;
