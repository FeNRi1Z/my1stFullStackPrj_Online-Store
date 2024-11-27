import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MonthlyOrdersChart = ({ data }) => {
	// Chart Data
	const chartData = {
		labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		datasets: [
			{
				label: "Monthly Orders",
				data: data,
				backgroundColor: "rgba(66, 165, 245, 0.5)",
				borderColor: "rgba(66, 165, 245, 1)",
				borderWidth: 1,
			},
		],
	};

	// Chart Options
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top",
			},
		},
	};

	return (
		<div style={{ width: "100%", margin: "0 auto" }}>
			<Bar data={chartData} options={options} />
		</div>
	);
};

export default MonthlyOrdersChart;
