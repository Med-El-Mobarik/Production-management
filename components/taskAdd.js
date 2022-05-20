import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";

const Declare = (props) => {
  const [declareSpin, setdeclareSpin] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setdeclareSpin(true);
    const tech = data.user.split(",")[0];
    const tech_name = data.user.split(",")[1];
    const fields = {
      content: data.content,
      done: false,
      tech: +tech,
      tech_name: tech_name,
    };
    const tachesCollectionRef = collection(db, "taches");
    await addDoc(tachesCollectionRef, fields);
    setdeclareSpin(false);
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div style={{ padding: "30px", width: "400px" }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FormControl style={{ marginBottom: "15px" }}>
            <InputLabel id="demo-simple-select-label">Technicien</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Technicien"
              {...register("user")}
            >
              {props.users.map((user) => {
                if (user.name != "erratby")
                  return (
                    <MenuItem value={`${user.id},${user.name}`}>
                      {user.name}
                    </MenuItem>
                  );
              })}
            </Select>
          </FormControl>
          <TextField
            required
            style={{ marginBottom: "15px" }}
            id="standard-basic"
            label="Description"
            variant="standard"
            {...register("content")}
          />

          {declareSpin ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {" "}
              <CircularProgress style={{ color: "#1da1f2" }} />
            </div>
          ) : (
            <Button
              variant="contained"
              style={{
                backgroundColor: "#1da1f2",
                border: 0,
                width: "100%",
                marginTop: "20px",
              }}
              type="submit"
            >
              Lancer
            </Button>
          )}
        </form>
      </div>
    </Dialog>
  );
};

export default Declare;
