import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import classes from "../sass/tech.module.scss";
import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Declare from "../components/declare";
import Task from "../components/taskDone";

import CheckIcon from "@mui/icons-material/Check";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const tech = () => {
  const [user, setuser] = useState({});
  const [taches, settaches] = useState([]);
  const [machines, setmachines] = useState([]);
  const [tachSpinner, settachSpinner] = useState(false);
  const [decopen, setdecopen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [doneId, setdoneId] = useState();

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const name = params.name;
    const id = params.id;
    // const conge = params.conge;
    const fireid = params.fireid;
    setuser({ name, id, conge: "" });

    const getTaches = async (id) => {
      settachSpinner(true);
      const tachesCollectionRef = collection(db, "taches");
      const data = await getDocs(tachesCollectionRef);
      // console.log(data);
      const allTaches = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      // console.log(allTaches);
      const taches = allTaches.filter((tache) => tache.tech == id);
      settaches(taches);
      settachSpinner(false);
    };
    getTaches(id);

    const getMachines = async (id) => {
      const machineCollectionRef = collection(db, "machines");
      const data = await getDocs(machineCollectionRef);
      const machines = data.docs.map((doc) => ({ ...doc.data() }));
      setmachines(machines);
    };
    getMachines();

    const getUser = async () => {
      const userRef = doc(db, "users", fireid);
      const data = await getDoc(userRef);
      const fetchedUser = data.data();
      setuser((prevUser) => {
        return {
          ...prevUser,
          conge: fetchedUser.conge,
        };
      });
    };
    getUser();
  }, []);

  const handleClose = () => {
    setdecopen(false);
    setTaskOpen(false);
  };

  return (
    <div className={classes.background}>
      <Task open={taskOpen} onClose={handleClose} id={doneId} />
      <Declare
        open={decopen}
        onClose={handleClose}
        machines={machines}
        tech={user.name}
      />
      <div className={classes.container}>
        <h2>Bonjour {user.name}</h2>
        <h3>Les tâches à faire:</h3>
        <TableContainer style={{ margin: "20px 0" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#a64bf4" }}>
              <TableRow>
                <TableCell style={{ color: "#fff" }}>Tâches</TableCell>
                <TableCell style={{ color: "#fff" }}>action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tachSpinner ? (
                <CircularProgress />
              ) : (
                taches.map((tach) => (
                  <TableRow>
                    <TableCell>{tach.content}</TableCell>
                    <TableCell>
                      <CheckIcon
                        onClick={() => {
                          setdoneId(tach.id);
                          setTaskOpen(true);
                        }}
                        style={{ color: "#27ae60", cursor: "pointer" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <h3>Congé:</h3>
        <p>
          {" "}
          <span style={{ color: "#a64bf4" }}>&rarr;</span> {user.conge}
        </p>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            style={{ backgroundColor: "#27ae60", border: 0, width: "45%" }}
          >
            <AccessTimeIcon /> Commencez votre journée
          </Button>
          <Button
            onClick={() => {
              setdecopen(true);
            }}
            variant="contained"
            style={{ backgroundColor: "#e74c3c", border: 0, width: "45%" }}
          >
            <ErrorOutlineIcon /> Déclarer un problème
          </Button>
        </div>
      </div>
    </div>
  );
};

export default tech;
