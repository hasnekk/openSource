import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import styles from "./Profile.module.css";

function Profile() {
  const { isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className={styles.profile}>
        <p>Log in to see your profile!</p>
        <button onClick={() => navigate("/home")}>Back to home</button>
      </div>
    );
  }

  const userKeys = Object.keys(user);

  return (
    <div className={styles.infos}>
      {userKeys.map((key) => {
        return (
          <span className={styles.info}>
            <p>name: </p>
            <p>Kristijan</p>
          </span>
        );
      })}
    </div>
  );
}

export default Profile;
