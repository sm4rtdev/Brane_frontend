import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import palette from "../../../../helpers/palette";
import { DataGrid } from "@mui/x-data-grid";
import { Doughnut } from "react-chartjs-2";
import { toast } from "react-toastify";

import "./StatisticsPage.scss";

import PageTransition from "../../../../components/PageTransition/PageTransition";
import BusinessHeader from "../../../../components/CustomHeaders/BusinessHeader";
import SpinnerOfDoom from "../../../../components/SpinnerOfDoom/SpinnerOfDoom";
import Footer from "../../../../components/Footer/Footer";
import { getReports } from "../../../../api/getReports";

ChartJS.register(ArcElement, Tooltip, Legend);

function MyTable({ rows }) {
  const columns = [
    { field: "userId", headerName: "User ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "courseId", headerName: "Course ID", flex: 1 },
    { field: "course", headerName: "Course", flex: 1 },
    {
      field: "progress",
      headerName: "Progress",
      flex: 1,
    },
    {
      field: "activity",
      headerName: "Activity",
      flex: 1,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
}

const StatisticsPage = () => {
  const [reports, setReports] = useState(null);
  const [rows, setRows] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [thereIsInfo, setThereIsInfo] = useState(false);

  const getAnaly = async () => {
    const { ok, data } = await getReports();

    console.log("Reports", data);

    if (ok) {
      setReports(data);
    } else {
      setReports([]);
      toast.error(`${data.error.message}`);
    }
  };

  useEffect(() => {
    getAnaly();
  }, []);

  useEffect(() => {
    if (reports) {
      let rows = [];

      let lol = reports.filter((c) => c.curso);

      lol.forEach((report) => {
        let courseArray = report.curso.map((c) => {
          return {
            userId: report.id,
            name: `${report.nombre} ${report.apellidos}`,
            course: c.curso.name,
            courseId: c.curso.id,
            progress: c.progress || 0,
            activity: c.activityRatio,
          };
        });

        rows.push(...courseArray);
      });

      rows.forEach((el, index) => (el.id = index));
      setRows(rows);
    }
  }, [reports]);

  useEffect(() => {
    if (rows) {
      let forDataset = rows.reduce((acc, item) => {
        if (!acc[item.course]) {
          acc[item.course] = {
            courseId: item.courseId,
            progress: item.progress || 0,
            count: 1,
          };
        } else {
          acc[item.course].progress += item.progress;
          acc[item.course].count += 1;
        }
        return acc;
      }, {});

      console.log("forDataset", forDataset);

      const averages = Object.values(forDataset).map((item) => {
        return {
          courseId: item.courseId,
          progress: item.progress / item.count,
        };
      });

      console.log("Averages", averages);

      const data = {
        labels: averages.map((item) => item.courseId),
        datasets: [
          {
            data: averages.map((item) => item.progress),
            backgroundColor: palette("mpn65", averages.length).map((hex) => {
              return "#" + hex;
            }),
          },
        ],
      };

      console.log("data", data);
      setGraphData(data);

      let num = 0;

      data.datasets[0].data.forEach((element) => {
        num += element;
      });

      if (num > 0) {
        setThereIsInfo(true);
      } else {
        setThereIsInfo(false);
      }
    }
  }, [rows]);

  return (
    <div id="statistics-page" className="page">
      <PageTransition>
        <BusinessHeader />
        <div className="main">
          <h1>Statistics</h1>

          {reports ? (
            rows ? (
              <>
                <h2>Rate of progress of every course</h2>
                <div className="chart">
                  {graphData && thereIsInfo ? (
                    <Doughnut data={graphData} />
                  ) : (
                    <p className="no-data">
                      None of your employees have progressed in any course.
                    </p>
                  )}
                </div>

                <h2>All employees</h2>
                <MyTable rows={rows} />
              </>
            ) : (
              <p className="no-data">
                None of your employees have progressed in any course.
              </p>
            )
          ) : (
            <SpinnerOfDoom standalone center />
          )}
        </div>
        <Footer unique company />
      </PageTransition>
    </div>
  );
};

export default StatisticsPage;
