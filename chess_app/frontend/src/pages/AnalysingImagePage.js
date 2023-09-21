import { Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AnalysingImagePage() {
  const { state } = useLocation();
  const [fen, setFen] = useState("");
  const navigate = useNavigate();
  console.log(state?.image);

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

      await axios.post("/api/send-image", formData, config).then((res) => {
        setFen(fen, res.data["fen"]);
        console.log(res);
        console.log(res.data["fen"]);
        navigate("/edit", { state: { fen: res.data["fen"] } });
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    console.log(fen);
  };

  useEffect(() => {
    sendImageToAPI(state?.image);
  }, []);

  return (
    <Grid
      container
      className="loadingPage"
      direction="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography component="h3" variant="h3">
        Analysing Image . . .
      </Typography>
    </Grid>
  );
}
