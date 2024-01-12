// 3-td party modules
import { Outlet } from "react-router-dom";

// css
import styles from "./AppLayout.module.css";

// my components
import Menu from "./components/Menu/Menu";

function AppLayout() {
  return (
    <>
      <Menu />
      <div className={styles.container}>
        <Outlet />
      </div>
    </>
  );
}

export default AppLayout;
