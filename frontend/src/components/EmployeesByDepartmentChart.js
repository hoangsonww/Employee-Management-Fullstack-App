// src/components/EmployeesLineChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getEmployeesByDepartment } from "../services/dashboardService";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const EmployeesLineChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await getEmployeesByDepartment();
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading chart...</div>;
    if (error) return <div>Error loading chart!</div>;
    if (!data || data.length === 0) return <div>No data available</div>;

    const lineChartData = {
        labels: data.map((d) => d.departmentName),
        datasets: [
            {
                label: "Employees by Department",
                data: data.map((d) => d.employeeCount),
                fill: false,
                borderColor: "#FF6384",
                backgroundColor: "#FF6384",
                tension: 0.1,
            },
        ],
    };

   

    return (
       
            <Line data={lineChartData} />
      
    );
};

export default EmployeesLineChart;
