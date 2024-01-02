import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import palette from "../../../../helpers/palette";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Pie } from "react-chartjs-2";

import "./HomeInstitutions.scss";

import { CTAInstitutions } from "../../../../assets/images";

import InstitutionHeader from "../../../../components/CustomHeaders/InstitutionHeader";
import PageTransition from "../../../../components/PageTransition/PageTransition";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Footer from "../../../../components/Footer/Footer";
import { getCoursesFromInstitution } from "../../../../api/getCoursesFromInstitution";
import { DictionaryContext } from "../../../../contexts/DictionaryContext";
import { UserDataContext } from "../../../../contexts/UserDataContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const MyTable = ({ rows }) => {
  const { dictionary, language } = useContext(DictionaryContext);

  const [initialRows, setInitialRows] = useState(null);
  const [filteredRows, setFilteredRows] = useState(null);

  const columnsByInstructor = [
    { field: "id", headerName: dictionary.privateIntitutions[8][language] },
    { field: "instructor", headerName: "Instructor", flex: 2 },
    { field: "courses", headerName: dictionary.privateIntitutions[9][language], flex: 1 },
    { field: "totalSales", headerName: dictionary.privateIntitutions[10][language], flex: 1 },
  ];

  const columnsByCourse = [
    { field: "id", headerName: dictionary.privateIntitutions[11][language] },
    { field: "course", headerName: dictionary.privateIntitutions[12][language], flex: 2 },
    { field: "totalSales", headerName: dictionary.privateIntitutions[10][language], flex: 1 },
  ];

  const [coursesOptions, setCoursesOptions] = useState(null);
  const [instructorsOptions, setInstructorsOptions] = useState(null);

  useEffect(() => {
    if (rows) {
      // For filtering by courses
      let courses = [];

      rows.forEach((row) => {
        // console.log(row);

        row.courses.forEach((course) => {
          let obj = {
            title: course.name,
            id: course.id,
            searchID: course.instructor.id,
          };
          courses.push(obj);
        });
      });

      setCoursesOptions(courses);

      // For filtering by instructors
      let instructors = [];

      rows.forEach((row) => {
        let obj = { title: row.instructor, id: row.id };
        instructors.push(obj);
      });

      setInstructorsOptions(instructors);

      // Initial State of the table
      let obj;

      obj = rows.map((row) => {
        return { ...row, courses: row.courses.length };
      });

      setInitialRows(obj);
    }
  }, [rows]);

  const [courseValue, setCourseValue] = useState(null);
  const [instructorValue, setInstructorValue] = useState(null);

  useEffect(() => {
    if (courseValue) {
      let [temp] = rows.filter((row) => row.id === courseValue.searchID);
      let second = temp.courses.filter((course) => course.id === courseValue.id);

      setFilteredRows(
        second.map((info) => {
          return {
            id: info.id,
            course: info.name,
            totalSales: info.cantidadEstudiantes,
          };
        })
      );
    } else if (instructorValue) {
      setFilteredRows(initialRows.filter((row) => row.id === instructorValue.id));
    } else {
      setFilteredRows(initialRows);
    }
  }, [rows, initialRows, instructorValue, courseValue]);

  return (
    <div style={{ height: 400, width: "100%" }} className="summary-data-table">
      <h2>{dictionary.privateIntitutions[13][language]}</h2>

      <div className="filters">
        {coursesOptions && (
          <Autocomplete
            options={coursesOptions}
            className="filterer-autocomplete"
            value={courseValue}
            onChange={(e, newValue) => {
              setCourseValue(newValue);
            }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label={dictionary.privateIntitutions[14][language]} />}
          />
        )}
        {instructorsOptions && (
          <Autocomplete
            options={instructorsOptions}
            className="filterer-autocomplete"
            value={instructorValue}
            onChange={(e, newValue) => {
              setInstructorValue(newValue);
            }}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => <TextField {...params} label={dictionary.privateIntitutions[15][language]} />}
          />
        )}
      </div>

      {filteredRows && (
        <DataGrid autoHeight rows={filteredRows} columns={courseValue ? columnsByCourse : columnsByInstructor} />
      )}
    </div>
  );
};

const HomeInstitutions = () => {
  const { dictionary, language } = useContext(DictionaryContext);

  const { userData } = useContext(UserDataContext);

  const [rawData, setRawData] = useState(null);
  const [rows, setRows] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [thereIsInfo, setThereIsInfo] = useState(false);

  useEffect(() => {
    const getTableData = async () => {
      const { ok, data } = await getCoursesFromInstitution();

      // console.log(data);

      if (ok) {
        if (data.length === 0) {
          setRawData([]);
        } else if (data[0].length === 0) {
          setRawData([]);
        } else {
          setRawData(data);
        }
      } else {
        toast.error(`${data.error.message}`);
      }
    };

    getTableData();
  }, []);

  useEffect(() => {
    if (rawData) {
      let table = [];

      for (let i = 0; i < rawData.length; i++) {
        const index = rawData[i];
        const currentInstructor = index[0].instructor;

        let totalSales = 0;

        for (let j = 0; j < index.length; j++) {
          totalSales += index[j].cantidadEstudiantes;
        }

        const obj = {
          id: currentInstructor.id,
          instructor: currentInstructor.nombre + " " + currentInstructor.apellidos,
          courses: index,
          totalSales,
        };

        table.push(obj);
      }

      // console.log(table);
      setRows(table);
    }
  }, [rawData]);

  useEffect(() => {
    if (rows) {
      // For the pie chart
      const data = {
        labels: rows.map((row) => row.instructor),
        // labels: ["Pepito", "Luis", "Lila"],
        datasets: [
          {
            data: rows.map((row) => row.totalSales),
            // data: [4, 2, 2],
            backgroundColor: palette("mpn65", rows.length).map((hex) => {
              return "#" + hex;
            }),
          },
        ],
      };

      let num = 0;
      data.datasets[0].data.forEach((element) => {
        num += element;
      });
      if (num > 0) {
        setThereIsInfo(true);
      } else {
        setThereIsInfo(false);
      }

      const options = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                const dataset = context.dataset;
                const label = context.label || "";

                if (dataset.data.length > 0) {
                  const currentValue = dataset.data[context.dataIndex];
                  const total = dataset.data.reduce((previousValue, currentValue) => previousValue + currentValue);

                  const percentage = ((currentValue / total) * 100).toFixed(2) + "%";
                  return `${percentage} (${currentValue} ${dictionary.privateIntitutions[0][language]})`;
                }

                return label;
              },
            },
          },
        },
      };

      setGraphData({ data, options });
    }
    //eslint-disable-next-line
  }, [rows, language]);

  return (
    <div id="institutions-page" className="page">
      <PageTransition margin>
        <InstitutionHeader />

        <div className="main">
          <strong>
            {dictionary.privateIntitutions[1][language]} <strong>{userData.info.nombre}.</strong>{" "}
            {dictionary.privateIntitutions[2][language]}
          </strong>
          <div className="cta">
            <div className="container">
              <strong>{dictionary.privateIntitutions[3][language]}</strong>
              <p>{dictionary.privateIntitutions[4][language]}</p>

              <Link to={"/manage-instructors"} className={"action-button black"}>
                {dictionary.privateIntitutions[5][language]}
              </Link>
            </div>

            <div className="background">
              <CTAInstitutions />
            </div>
          </div>

          {rawData ? (
            <div className="summary">
              {rows && <MyTable rows={rows} />}

              <div className="summary-graph">
                <h2>{dictionary.privateIntitutions[6][language]}</h2>

                {graphData && thereIsInfo ? (
                  <Pie data={graphData.data} options={graphData.options} />
                ) : (
                  <p className="no-data">{dictionary.privateIntitutions[7][language]}</p>
                )}
              </div>
            </div>
          ) : (
            <SpinnerOfDoom standalone />
          )}
        </div>

        <Footer unique />
      </PageTransition>
    </div>
  );
};

export default HomeInstitutions;
