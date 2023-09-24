import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";

export default function HomePage() {
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      navigate("/loading", { state: { image: reader.result } });
    };
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Grid
              className="buttonGroup"
              container
              spacing={5}
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Link to="/capture">
                <Button>Take a Picture</Button>
              </Link>

              <label className="MuiButtonBase-root MuiButton-root MuiButton-text">
                <Input
                  type="file"
                  onChange={handleImageChange}
                  disableUnderline={true}
                  accept="image/png, image/jpeg"
                />
                Choose Image
              </label>

              <Link
                to="/edit"
                state={{
                  fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                }}
              >
                <Button>Editable Board</Button>
              </Link>
            </Grid>
          </div>
        }
      />
    </Routes>
  );
}
