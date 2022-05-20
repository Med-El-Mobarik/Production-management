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

const declare = (props) => {
  const [declareSpin, setdeclareSpin] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setdeclareSpin(true);
    const fields = {
      ...data,
      heures_inactives: +data.heures_inactives,
      heures_normales: +data.heures_normales,
      tech: props.tech,
    };
    const issuesCollectionRef = collection(db, "issues");
    await addDoc(issuesCollectionRef, fields);
    setdeclareSpin(false);
    props.onClose();
    // location.reload();
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
            <InputLabel id="demo-simple-select-label">Machine</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Machine"
              {...register("machine")}
            >
              {props.machines.map((machine) => (
                <MenuItem value={machine.name}>{machine.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            required
            style={{ marginBottom: "15px" }}
            id="standard-basic"
            label="Description"
            variant="standard"
            {...register("description")}
          />
          <TextField
            required
            style={{ marginBottom: "15px" }}
            id="standard-basic"
            label="Heures inactives"
            variant="standard"
            type="number"
            {...register("heures_inactives")}
          />
          <TextField
            required
            style={{ marginBottom: "15px" }}
            id="standard-basic"
            label="Heures normales"
            variant="standard"
            type="number"
            {...register("heures_normales")}
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
              <CircularProgress color="error" />
            </div>
          ) : (
            <Button
              // onClick={() => {
              //   setdecopen(true);
              // }}
              variant="contained"
              style={{
                backgroundColor: "#e74c3c",
                border: 0,
                width: "100%",
                marginTop: "20px",
              }}
              type="submit"
            >
              Déclarer
            </Button>
          )}
        </form>
      </div>
    </Dialog>
  );
};

export default declare;
