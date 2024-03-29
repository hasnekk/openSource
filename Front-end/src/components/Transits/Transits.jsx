import styles from "./Transits.module.css";

// my components
import TranistsTable from "./TransitsTable.jsx";
import TransitsFilter from "./TransitsFilter.jsx";

function Transits() {
  return (
    <div className={styles.container}>
      <TransitsFilter />
      <TranistsTable />
    </div>
  );
}

export default Transits;
