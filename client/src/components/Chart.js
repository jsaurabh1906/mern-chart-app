import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chart.css";
import { format } from "date-fns";
import { Line } from "react-chartjs-2";
import { saveAs } from "file-saver";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const [data, setData] = useState([]);
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");

  const formatDate = (timestamp) => {
    // Format the timestamp to display only date and time
    return format(new Date(timestamp), "yyyy-MM-dd HH:mm:ss");
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/temperatures?limit=10`
      );
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addSampleData = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/temperatures`, {
        temperature,
        humidity,
        windSpeed,
      });
      fetchData();
      setTemperature("");
      setHumidity("");
      setWindSpeed("");
    } catch (error) {
      console.error(error);
    }
  };
  const chartData = {
    labels: data.map((item) => formatDate(item.timestamp)), // Use formatDate to format the timestamp
    datasets: [
      {
        label: "Temperature",
        data: data.map((item) => item.temperature),
        fill: false,
        borderColor: "rgb(190, 190, 12)",
        tension: 0.1,
      },
      {
        label: "Humidity",
        data: data.map((item) => item.humidity),
        fill: false,
        borderColor: "rgb(120, 12, 75)",
        tension: 0.1,
      },
      {
        label: "Wind Speed",
        data: data.map((item) => item.windSpeed),
        fill: false,
        borderColor: "rgb(12, 120, 192)",
        tension: 0.1,
      },
    ],
  };
  const downloadCSV = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/temperatures/export`,
        {
          responseType: "blob", // Set response type to "blob" to receive binary data
        }
      );

      // Use FileSaver.js to trigger the file download
      saveAs(response.data, "data.csv");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="chart-container">
      <h1>Live Data Chart</h1>
      <div className="inputs">
        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          placeholder="Temperature"
        />
        <input
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          placeholder="Humidity"
        />
        <input
          type="number"
          value={windSpeed}
          onChange={(e) => setWindSpeed(e.target.value)}
          placeholder="Wind Speed"
        />
        <button onClick={addSampleData}>Add Sample Data</button>
        <button onClick={downloadCSV}>Export to CSV</button>
      </div>
      <div className="chart">
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default Chart;
