import React from "react";

import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { Col } from "antd";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const IncomeProfitChart = ({ data }) => {
	// Months for X-axis labels
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Chart data for Line chart
	const chartData = {
		labels: months, // X-axis labels
		datasets: [
			{
				label: "Monthly Income",
				data: data.monthlyIncome,
				borderColor: "#42a5f5",
				backgroundColor: "rgba(66, 165, 245, 0.5)",
				tension: 0.4,
			},
			{
				label: "Monthly Profit",
				data: data.monthlyProfit,
				borderColor: "#66bb6a",
				backgroundColor: "rgba(102, 187, 106, 0.5)",
				tension: 0.4,
			},
		],
	};

	// Chart options for Line chart
	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top",
			},
			tooltip: {
				enabled: true,
				callbacks: {
					label: function (tooltipItem) {
						return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
					},
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Months",
				},
			},
			y: {
				title: {
					display: true,
					text: "Amount (in Baht)",
				},
			},
		},
	};

	return (
		<Col xs={{
            flex: "10%",
        }}>
			<Line data={chartData} options={options} />
		</Col>
	);
};

export default IncomeProfitChart;
