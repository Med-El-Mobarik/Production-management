import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import classes from "../sass/tech.module.scss";
import { db } from "../config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Button from "@mui/material/Button";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddTaskIcon from "@mui/icons-material/AddTask";
import DeleteIcon from "@mui/icons-material/Delete";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Add from "../components/taskAdd";
import Del from "../components/delIssue";

const Admin = () => {
  const [user, setuser] = useState({});
  const [taches, settaches] = useState([]);
  const [tachSpinner, settachSpinner] = useState(false);
  const [addOpen, setaddOpen] = useState(false);
  const [delOpen, setdelOpen] = useState(false);
  const [issuDelId, setissuDelId] = useState();
  const [users, setusers] = useState([]);
  const [issues, setissues] = useState([]);

  const handleClose = () => {
    setaddOpen(false);
    setdelOpen(false);
  };

  const affecterConge = async (id) => {
    const userDoc = doc(db, "users", id);
    const newFields = { conge: "Oui" };
    await updateDoc(userDoc, newFields);
    location.reload();
  };
  const desaffecterConge = async (id) => {
    const userDoc = doc(db, "users", id);
    const newFields = { conge: "Non" };
    await updateDoc(userDoc, newFields);
    location.reload();
  };

  useEffect(() => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    const name = params.name;
    setuser({ name });

    const getTaches = async () => {
      settachSpinner(true);
      const tachesCollectionRef = collection(db, "taches");
      const data = await getDocs(tachesCollectionRef);
      // console.log(data);
      const allTaches = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      // console.log(allTaches);
      settaches(allTaches);
      settachSpinner(false);
    };
    getTaches();

    const getIssues = async () => {
      settachSpinner(true);
      const issuesCollectionRef = collection(db, "issues");
      const data = await getDocs(issuesCollectionRef);
      const allIssues = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setissues(allIssues);
      settachSpinner(false);
    };
    getIssues();

    const getUsers = async () => {
      const usersCollectionRef = collection(db, "users");
      const data = await getDocs(usersCollectionRef);
      const allUsers = data.docs.map((doc) => ({
        ...doc.data(),
        fireId: doc.id,
      }));
      setusers(allUsers);
    };
    getUsers();
  }, []);

  return (
    <div className={classes.background}>
      <Del open={delOpen} onClose={handleClose} id={issuDelId} />
      <Add open={addOpen} onClose={handleClose} users={users} />
      <div
        className={classes.container}
        style={{ height: "92%", width: "96%" }}
      >
        <h2 style={{ marginTop: "0px" }}>Bonjour Mr. {user.name}</h2>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "46%" }}>
            <h3>Tous les tâches:</h3>
            <TableContainer style={{ margin: "20px 0" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ backgroundColor: "#1da1f2" }}>
                  <TableRow>
                    <TableCell style={{ color: "#fff" }}>Tâche</TableCell>
                    <TableCell style={{ color: "#fff" }}>Technicien</TableCell>
                    <TableCell style={{ color: "#fff" }}>Done</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tachSpinner ? (
                    <CircularProgress />
                  ) : (
                    taches.map((tach, key) => (
                      <TableRow key={key}>
                        <TableCell>{tach.content}</TableCell>
                        <TableCell>{tach.tech_name}</TableCell>
                        <TableCell>
                          {tach.done ? (
                            <CheckIcon
                              onClick={() => {
                                setdoneId(tach.id);
                                setTaskOpen(true);
                              }}
                              style={{ color: "#27ae60" }}
                            />
                          ) : (
                            <CloseIcon style={{ color: "#e74c3c" }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => {
                  setaddOpen(true);
                }}
                variant="contained"
                style={{ backgroundColor: "#1da1f2" }}
              >
                {" "}
                <AddTaskIcon />
                &nbsp;&nbsp;Lancer une nouvelle tâche
              </Button>
            </div>
          </div>
          <div style={{ width: "53%" }}>
            <h3 style={{ color: "#e74c3c" }}>Tous les probèmes:</h3>
            <TableContainer style={{ margin: "20px 0" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ backgroundColor: "#e74c3c" }}>
                  <TableRow>
                    <TableCell style={{ color: "#fff" }}>Issue</TableCell>
                    <TableCell style={{ color: "#fff" }}>Technicien</TableCell>
                    <TableCell style={{ color: "#fff" }}>Machine</TableCell>
                    <TableCell style={{ color: "#fff" }}>
                      Inactivité(%)
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}>Supp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tachSpinner ? (
                    <CircularProgress />
                  ) : (
                    issues.map((tach, key) => (
                      <TableRow key={key}>
                        <TableCell>{tach.description}</TableCell>
                        <TableCell>{tach.tech}</TableCell>
                        <TableCell>{tach.machine}</TableCell>
                        <TableCell>
                          {(
                            (tach.heures_inactives / tach.heures_normales) *
                            100
                          ).toFixed(2)}{" "}
                          %
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            onClick={() => {
                              setissuDelId(tach.id);
                              setdelOpen(true);
                            }}
                            style={{ color: "#e74c3c", cursor: "pointer" }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <h3 style={{ color: "#a64bf4" }}>Tous les Techniciens:</h3>
        <TableContainer style={{ margin: "20px 0" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead style={{ backgroundColor: "#a64bf4" }}>
              <TableRow>
                <TableCell style={{ color: "#fff" }}>Id</TableCell>
                <TableCell style={{ color: "#fff" }}>Name</TableCell>
                <TableCell style={{ color: "#fff" }}>Machine</TableCell>
                <TableCell style={{ color: "#fff" }}>Congé</TableCell>
                <TableCell style={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tachSpinner ? (
                <CircularProgress />
              ) : (
                users
                  .filter((user) => user.name != "erratby")
                  .map((tach, key) => (
                    <TableRow key={key}>
                      <TableCell>{tach.id}</TableCell>
                      <TableCell>{tach.name}</TableCell>
                      <TableCell>{tach.machine}</TableCell>
                      <TableCell>{tach.conge}</TableCell>
                      <TableCell>
                        <div
                          onClick={() => affecterConge(tach.fireId)}
                          className={classes.action}
                        >
                          Affecter un congé
                        </div>{" "}
                        /{" "}
                        <div
                          onClick={() => desaffecterConge(tach.fireId)}
                          className={classes.action}
                        >
                          désaffecter congé
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Admin;
