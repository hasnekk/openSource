import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// 3-td party modules
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

// MY CSS
import styles from "./TransitsTable.module.css";

// my components
import Spinner from "../Spinner/Spinner.jsx";

// MUI COMPONENTS
// button
import Button from "@mui/material/Button";

// REACT ICONS
import { HiCloudArrowDown } from "react-icons/hi2";

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

const mistakeForPouplation = 100000;
const mistakeForArea = 500;
const mistakeForDistance = 500;
const mistakeForDuration = 1.5;
const mistakeForPrice = 20;

function TransitsTable() {
  let [searchParams] = useSearchParams();

  // functions for downloading filtered data
  function prepareJsonData() {
    // Transform the data into the desired format
    const jsonData = rows.map((transit) => {
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
    rows.forEach((transit) => {
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

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      error.message +
      ", Error with loading data from server. Please try again later."
    );
  }

  let rows = transits.data;

  let filterValue = searchParams.get("filterValue");
  let filterBy = searchParams.get("filterBy");

  if (filterBy && filterValue !== "") {
    if (filterBy === "*") {
      let helpRows = rows.map((transit) => {
        const matchingDestinations = transit.destinations.filter(
          (destination) => {
            const destinationDistance = parseFloat(destination.distance);
            const destinationPrice = parseFloat(destination.price);
            const durationTime = parseFloat(destination.duration);

            return (
              destination.destination
                .toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              Math.abs(destinationDistance - parseFloat(filterValue)) <=
                mistakeForDistance ||
              Math.abs(durationTime - parseFloat(filterValue)) <=
                mistakeForDuration ||
              Math.abs(destinationPrice - parseFloat(filterValue)) <=
                mistakeForPrice
            );
          }
        );

        return {
          ...transit,
          destinations: matchingDestinations,
        };
      });

      rows = rows.filter((transit) => {
        return (
          transit.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
          transit.country?.toLowerCase().includes(filterValue.toLowerCase()) ||
          transit.region?.toLowerCase().includes(filterValue.toLowerCase()) ||
          transit.language?.toLowerCase().includes(filterValue.toLowerCase()) ||
          transit.currency?.toLowerCase().includes(filterValue.toLowerCase()) ||
          transit.timezone?.toLowerCase().includes(filterValue.toLowerCase()) ||
          Math.abs(
            parseFloat(transit.population, 10) - parseFloat(filterValue, 10)
          ) <= mistakeForPouplation ||
          Math.abs(
            parseFloat(transit.area, 10) - parseFloat(filterValue, 10)
          ) <= mistakeForArea
        );
      });

      // Combine helpRows and rows
      const combinedRows = [...helpRows, ...rows];

      // Remove duplicates by converting them into a Set
      const uniqueRows = Array.from(
        new Set(combinedRows.map(JSON.stringify))
      ).map(JSON.parse);

      // Remove rows with empty destinations
      const filteredRows = uniqueRows.filter(
        (transit) => transit.destinations.length > 0
      );

      // Update the rows variable with the filtered and unique rows
      rows = filteredRows;
    } else {
      let helpRows = rows.map((transit) => {
        const matchingDestinations = transit.destinations.filter(
          (destination) => {
            if (filterBy === "price") {
              const destinationPrice = parseFloat(destination.price);
              return (
                Math.abs(destinationPrice - parseFloat(filterValue)) <=
                mistakeForPrice
              );
            } else if (filterBy === "distance") {
              const destinationDistance = parseFloat(destination.distance);
              return (
                Math.abs(destinationDistance - parseFloat(filterValue)) <=
                mistakeForDistance
              );
            } else if (filterBy === "duration") {
              const destinationDuration = parseFloat(destination.duration);
              return (
                Math.abs(destinationDuration - parseFloat(filterValue)) <=
                mistakeForDuration
              );
            } else if (filterBy === "destination") {
              return destination[filterBy]
                .toLowerCase()
                .includes(filterValue.toLowerCase());
            } else {
              return false;
            }
          }
        );

        return { ...transit, destinations: matchingDestinations };
      });

      console.log(rows);

      rows = rows.filter((transit) => {
        if (filterBy === "population") {
          const transitPopulation = parseFloat(transit.population);
          return (
            Math.abs(transitPopulation - parseFloat(filterValue)) <=
            mistakeForPouplation
          );
        } else if (filterBy === "area") {
          const transitArea = parseFloat(transit.area);
          return (
            Math.abs(transitArea - parseFloat(filterValue)) <= mistakeForArea
          );
        } else {
          return transit[filterBy]
            ?.toLowerCase()
            .includes(filterValue.toLowerCase());
        }
      });

      // Combine helpRows and rows
      const combinedRows = [...helpRows, ...rows];

      // Remove duplicates by converting them into a Set
      const uniqueRows = Array.from(
        new Set(combinedRows.map(JSON.stringify))
      ).map(JSON.parse);

      // Remove rows with empty destinations
      const filteredRows = uniqueRows.filter(
        (transit) => transit.destinations.length > 0
      );

      // Update the rows variable with the filtered and unique rows
      rows = filteredRows;
    }
  }

  if (rows.length === 0) {
    return <h1>No results found for "{filterValue}"</h1>;
  }

  return (
    <div className={styles.container}>
      <Paper sx={{ width: "100%" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={8}>
                  Departure city
                </TableCell>
                <TableCell align="center" colSpan={4}>
                  Destination city
                </TableCell>
              </TableRow>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((transit) => {
                return transit.destinations.map((destination, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={`${transit.id}_${index}`}
                  >
                    {columns.map((column) => {
                      const value =
                        destination[column.id] || transit[column.id];

                      const hitByNumericFilter =
                        typeof value === "number" &&
                        filterValue !== "" &&
                        (filterBy === column.id || filterBy === "*") &&
                        ((column.id === "population" &&
                          Math.abs(
                            parseFloat(transit.population, 10) -
                              parseFloat(filterValue, 10)
                          ) <= 100000) ||
                          (column.id === "area" &&
                            Math.abs(
                              parseFloat(transit.area, 10) -
                                parseFloat(filterValue, 10)
                            ) <= 500) ||
                          (column.id === "distance" &&
                            Math.abs(
                              destination.distance - parseFloat(filterValue)
                            ) <= 500) ||
                          (column.id === "duration" &&
                            Math.abs(
                              destination.duration - parseFloat(filterValue)
                            ) <= 1.5) ||
                          (column.id === "price" &&
                            Math.abs(
                              destination.price - parseFloat(filterValue)
                            ) <= 20) ||
                          false) // Default to false if no numeric rule matches
                          ? `${styles.highlightedCell}` // Apply the CSS class for highlighting
                          : "";

                      const hitByStringFilter =
                        typeof value === "string" &&
                        filterValue !== "" &&
                        (filterBy === column.id || filterBy === "*") &&
                        value.toLowerCase().includes(filterValue?.toLowerCase())
                          ? `${styles.highlightedCell}` // Apply the CSS class for highlighting
                          : "";

                      // Combine the two highlighting conditions
                      const hitByFilterCell =
                        hitByNumericFilter || hitByStringFilter;

                      return (
                        <TableCell
                          className={hitByFilterCell}
                          key={column.id}
                          align={column.align}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ));
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <div className={styles.buttonsDiv}>
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
    </div>
  );
}

export default TransitsTable;
