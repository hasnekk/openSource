import styles from "./Transits.module.css";

// my components
import TranistsTable from "./TransitsTable.jsx";
import TransitsFiler from "./TransitsFilter.jsx";

function Transits() {
  return (
    <div className={styles.container}>
      <TransitsFiler />
      <TranistsTable />
    </div>
  );
}

export default Transits;
