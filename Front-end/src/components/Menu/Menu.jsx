// 3-td party modules
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// css
import styles from "./Menu.module.css";

function Menu() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } =
    useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  console.log(user);
  console.log(isAuthenticated);

  async function login() {
    await loginWithRedirect();
  }

  return (
    <div className={styles.menuContainer}>
      <h1>Transit between cities</h1>
      <div className={styles.menu}>
        <NavLink to="/home" className={styles.menuItem}>
          Home
        </NavLink>
        <NavLink to="/transits" className={styles.menuItem}>
          Transits
        </NavLink>
        {!isAuthenticated && (
          <>
            <NavLink to="/profile" className={styles.menuItem}>
              Profile
            </NavLink>
            <NavLink to="/refresh" className={styles.menuItem}>
              Osvježi preslike
            </NavLink>
          </>
        )}
      </div>
      <div className={styles.user}>
        <img src="/img/default-user.jpg" alt="user" />
        <span>{user?.name}</span>
        {!isAuthenticated ? (
          <span className={styles.logInBtn} onClick={login}>
            Log in
          </span>
        ) : (
          <span
            className={styles.logOutBtn}
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log out
          </span>
        )}
      </div>
    </div>
  );
}

export default Menu;
