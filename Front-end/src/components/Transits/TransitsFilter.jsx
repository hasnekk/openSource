// 3-td party modules
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// MY CSS
import styles from "./TransitsFilter.module.css";

// MUI COMPONENTS
// button
import Button from "@mui/material/Button";
// select
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// text field
import TextField from "@mui/material/TextField";

// REACT ICONS
import { HiMiniFunnel, HiMiniPower } from "react-icons/hi2";

function TransitsFilter() {
  const navigate = useNavigate();

  const [filterBy, setFilterBy] = useState("*");
  const [filterValue, setFilterValue] = useState("");

  function filterData() {
    navigate(`/transits?filterValue=${filterValue}&filterBy=${filterBy}`);
  }

  function clearFilter() {
    setFilterBy("*");
    setFilterValue("");
    navigate(`/transits`);
  }

  return (
    <div className={styles.container}>
      <TextField
        id="outlined-basic"
        label="Filter value"
        variant="outlined"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />

      <span className={styles.selectDiv}>
        <InputLabel id="demo-simple-select-label">Filter by</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          <MenuItem value="*">All</MenuItem>
          <MenuItem value="name">Departure city</MenuItem>
          <MenuItem value="country">Departure country (abbreviation) </MenuItem>
          <MenuItem value="region">Departure region</MenuItem>
          <MenuItem value="population">Departure population</MenuItem>
          <MenuItem value="language">Departure language</MenuItem>
          <MenuItem value="currency">Departure currency</MenuItem>
          <MenuItem value="timezone">Departure timezone</MenuItem>
          <MenuItem value="area">Departure area</MenuItem>
          <MenuItem value="destination">Destination name</MenuItem>
          <MenuItem value="distance">Distance to travell</MenuItem>
          <MenuItem value="duration">Travell duration</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </Select>
      </span>

      <div className={styles.buttonsDiv}>
        <Button
          onClick={filterData}
          variant="contained"
          endIcon={<HiMiniFunnel />}
        >
          Filter
        </Button>

        <Button
          onClick={clearFilter}
          variant="outlined"
          color="error"
          endIcon={<HiMiniPower />}
        >
          Clear filter
        </Button>
      </div>
    </div>
  );
}

export default TransitsFilter;
