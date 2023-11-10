// 3-td party modules
import { Link } from "react-router-dom";

// css
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.dataInfo}>
        <h1>Data info</h1>
        <div className={styles.infoTable}>
          <div className={styles.infoRow}>
            <strong>License: </strong>
            <p>
              MIT License - License with conditions only requiring preservation
              of copyright and license notices. Licensed works, modifications,
              and larger works may be distributed under different terms and
              without source code.
            </p>
          </div>
          <div className={styles.infoRow}>
            <strong>Author: </strong>
            <p>Kristijan Hasnek</p>
          </div>
          <div className={styles.infoRow}>
            <strong>Version: </strong>
            <p>1.0</p>
          </div>
          <div className={styles.infoRow}>
            <strong>Data language: </strong>
            <p>English</p>
          </div>
          <div className={styles.infoRow}>
            <strong>Frequency of update: </strong>
            <p>Weekly</p>
          </div>
        </div>

        <div className={styles.fieldDescription}>
          <h3>Fields description</h3>
          <ul>
            <li>
              <strong>Name:</strong> name of the city we departure from
            </li>
            <li>
              <strong>
                country, region, population, language, currency, timezone, area:
              </strong>
              information about the city we departure from
            </li>
            <li>
              <strong>Transit Routes:</strong> array of cities we can travel to
              from the current city
            </li>
            <li>
              <strong>Distance</strong> is the distance between the current city
              and the city we can travel to in kilometers
            </li>
            <li>
              <strong>Price</strong> is the price of the ticket from the current
              city to the city we can travel to in euros
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.downloadData}>
        <h2>Download raw data</h2>
        <Link to="/files/dbDump.json" target="_blank" download>
          Json file
        </Link>
        <Link to="/files/dbDump.csv" target="_blank" download>
          CSV file
        </Link>
      </div>
    </div>
  );
}

export default Home;
