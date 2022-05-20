import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import { db } from "../config/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";

const TaskDone = (props) => {
  const [doneSpinner, setDoneSpinner] = useState(false);

  const deleteIssue = async (id) => {
    setDoneSpinner(true);
    const issueDoc = doc(db, "issues", id);
    await deleteDoc(issueDoc);
    setDoneSpinner(false);
    location.reload();
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <div
        style={{
          width: "450px",
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>Vous voulez vraiment supprimer cette problème ?</p>

        {doneSpinner ? (
          <CircularProgress style={{ color: "#e74c3c" }} />
        ) : (
          <Button
            onClick={() => deleteIssue(props.id)}
            style={{ color: "#e74c3c" }}
          >
            Confirmer
          </Button>
        )}
      </div>
    </Dialog>
  );
};

export default TaskDone;
