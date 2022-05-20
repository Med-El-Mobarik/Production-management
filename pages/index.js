import { useState } from "react";
import Script from "next/script";
import CircularProgress from "@mui/material/CircularProgress";
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

const index = () => {
  const [circular, setcircular] = useState(false);

  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setcircular(true);
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const uname = username.value;
    const pass = username.value;

    const userCollectionRef = collection(db, "users");
    const data = await getDocs(userCollectionRef);
    const users = data.docs.map((doc) => ({ ...doc.data(), fireId: doc.id }));

    let registred;
    users.map((user) => {
      if (user.name == uname && user.password == pass) {
        registred = true;
        if (user.admin) {
          router.push(`/admin?name=${user.name}`);
        } else {
          router.push(
            `/tech?name=${user.name}&id=${user.id}&fireid=${user.fireId}`
          );
        }
      }
    });

    if (!registred) {
      alert("Vous n'êtes pas enregistré");
    }

    setcircular(false);
  };

  return (
    <>
      <div className="limiter">
        <div
          className="container-login100"
          style={{ backgroundImage: "url('images/bg-01.jpg')" }}
        >
          <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
            <form onSubmit={onSubmit} className="login100-form validate-form">
              <span className="login100-form-title p-b-49">Login</span>

              <div
                className="wrap-input100 validate-input m-b-23"
                data-validate="Username is reauired"
              >
                <span className="label-input100">Username</span>
                <input
                  required
                  className="input100"
                  type="text"
                  name="username"
                  placeholder="Type your username"
                  id="username"
                />
                {/* <span className="focus-input100" dataSymbol="&#xf206"></span> */}
              </div>

              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <span className="label-input100">Password</span>
                <input
                  required
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Type your password"
                  id="password"
                />
              </div>

              <div className="text-right p-t-8 p-b-31" style={{ opacity: 0 }}>
                <a href="#">Forgot password?</a>
              </div>

              {circular ? (
                <div className="container-login100-form-btn">
                  <CircularProgress color="secondary" />
                </div>
              ) : (
                <div className="container-login100-form-btn">
                  <div className="wrap-login100-form-btn">
                    <div className="login100-form-bgbtn"></div>
                    <button className="login100-form-btn">Login</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div id="dropDownSelect1"></div>
      {/* <Script src="vendor/jquery/jquery-3.2.1.min.js" />
      <Script src="vendor/animsition/js/animsition.min.js" />
      <Script src="vendor/bootstrap/js/popper.js" />
      <Script src="vendor/bootstrap/js/bootstrap.min.js" />
      <Script src="vendor/select2/select2.min.js" />
      <Script src="vendor/daterangepicker/moment.min.js" />
      <Script src="vendor/daterangepicker/daterangepicker.js" />
      <Script src="vendor/countdowntime/countdowntime.js" />
      <Script src="js/main.js" /> */}
    </>
  );
};

export default index;
