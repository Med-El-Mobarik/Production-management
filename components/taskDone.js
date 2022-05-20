import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { db } from "../config/firebase";
import { updateDoc, doc } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";

const TaskDone = (props) => {
  const [doneSpinner, setDoneSpinner] = useState(false);

  const doneTach = async (id) => {
    setDoneSpinner(true);
    const tachDoc = doc(db, "taches", id);
    const newFields = { done: true };
    await updateDoc(tachDoc, newFields);
    setDoneSpinner(false);
    alert("La tâche a été enregistrée comme terminée");
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div
        style={{
          width: "400px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Vous avez bien terminé cette tâche ?</p>

        {doneSpinner ? (
          <CircularProgress style={{ color: "#27ae60" }} />
        ) : (
          <Button
            onClick={() => doneTach(props.id)}
            style={{ color: "#27ae60" }}
          >
            Confirmer
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default TaskDone;
