// 3-td party modules
import { NavLink } from "react-router-dom";

// css
import styles from "./Menu.module.css";

function Menu() {
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
      </div>
    </div>
  );
}

export default Menu;
