// 3-td party modules
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

// MY CSS
import styles from "./Refresh.module.css";

// my components
import Spinner from "../Spinner/Spinner.jsx";

// MUI COMPONENTS
// button
import Button from "@mui/material/Button";

// REACT ICONS
import { HiCloudArrowDown } from "react-icons/hi2";

// FOR CSV DUMP
const columns = [
  { id: "name", label: "Name", minWidth: 100 },
  { id: "country", label: "Country", minWidth: 60 },
  { id: "region", label: "Region", minWidth: 100 },
  {
    id: "population",
    label: "Population",
    minWidth: 60,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  { id: "language", label: "Language", minWidth: 60 },
  { id: "currency", label: "Currency", minWidth: 60 },
  { id: "timezone", label: "Timezone", minWidth: 60 },
  { id: "area", label: "Area (km^2)", minWidth: 80 },
  { id: "destination", label: "Destination", minWidth: 80 },
  { id: "distance", label: "Distance (km)", minWidth: 80 },
  { id: "duration", label: "Duration (h)", minWidth: 80 },
  { id: "price", label: "Price (eur)", minWidth: 80 },
];

function Refresh() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // functions for downloading filtered data
  function prepareJsonData() {
    // Transform the data into the desired format
    const jsonData = downloadTransits.map((transit) => {
      return {
        name: transit.name,
        country: transit.country,
        region: transit.region,
        population: transit.population,
        language: transit.language,
        currency: transit.currency,
        timezone: transit.timezone,
        area: transit.area,
        destinations: transit.destinations.map((destination) => ({
          name: destination.destination,
          distance: destination.distance,
          duration: destination.duration,
          price: destination.price,
        })),
      };
    });

    return jsonData;
  }

  function prepareCsvData() {
    const csvData = [];

    // Add the header row
    csvData.push(columns.map((column) => column.label));

    // Iterate through each transit (city)
    downloadTransits.forEach((transit) => {
      // Iterate through each destination of the transit (city)
      transit.destinations.forEach((destination) => {
        const row = [
          transit.name,
          transit.country,
          transit.region,
          transit.population,
          transit.language,
          transit.currency,
          transit.timezone,
          transit.area,
          destination.destination,
          destination.distance,
          destination.duration,
          destination.price,
        ];

        // Add the row to the csvData
        csvData.push(row);
      });
    });

    return csvData;
  }

  // function for retrieving data from server
  const {
    isLoading,
    data: transits,
    error,
  } = useQuery({
    queryKey: ["transits"],
    queryFn: () => {
      return axios.get("http://localhost:3000/transits");
    },
  });

  const downloadTransits = transits.data;

  if (isAuthenticated) {
    return (
      <div className={styles.refresh}>
        <p>Log in to see your profile!</p>
        <button onClick={() => navigate("/home")}>Back to home</button>
      </div>
    );
  }

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      error.message +
      ", Error with loading data from server. Please try again later."
    );
  }

  return (
    <div className={styles.btnDiv}>
      <Button
        variant="contained"
        endIcon={<HiCloudArrowDown />}
        onClick={() => {
          try {
            const csvData = prepareCsvData();
            const blob = new Blob([csvData.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transits.csv";
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Data downloaded successfully!");
          } catch (e) {
            console.log(e);
            toast.error(
              "Error with downloading data as CSV. Please try again later."
            );
          }
        }}
      >
        Download data as CSV
      </Button>
      <Button
        variant="contained"
        endIcon={<HiCloudArrowDown />}
        onClick={() => {
          try {
            const jsonData = prepareJsonData();
            const jsonString = JSON.stringify(jsonData, null, 4); // The '4' specifies the number of spaces for indentation
            const blob = new Blob([jsonString], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transits.json";
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Data downloaded successfully!");
          } catch (e) {
            toast.error(
              "Error with downloading data as JSON. Please try again later."
            );
          }
        }}
      >
        Download data as JSON
      </Button>
    </div>
  );
}

export default Refresh;
