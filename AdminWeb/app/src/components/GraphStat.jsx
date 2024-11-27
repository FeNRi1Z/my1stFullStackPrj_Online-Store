import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

import { Card, Col } from "antd";

import IncomeProfitChart from "./IncomeProfitChart";
import MonthlyOrdersChart from "./MonthlyOrdersChart";

const GraphStat = () => {
	const [incomeProfitData, setIncomeProfitData] = useState({});
	const [monthlyOrdersData, setMonthlyOrdersData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTopProducts = async () => {
			try {
				const fetchIncomProfit = await axios.get(config.apiPath + "/order/stat/incomeProfitMonthly", config.headers());
				setIncomeProfitData(fetchIncomProfit.data.results);

				const fetchMonthlyOrders = await axios.get(config.apiPath + "/order/stat/orderMonthly", config.headers());
                setMonthlyOrdersData(fetchMonthlyOrders.data.monthlyOrders);
			} catch (error) {
				console.error("Error fetching top products:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTopProducts();
	}, []);

	const tabListNoTitle = [
		{
			key: "Financial",
			label: "Financial",
		},
		{
			key: "Monthly Orders",
			label: "Monthly Orders",
		},
	];
	const contentListNoTitle = {
		Financial: (
			<>
				<h2>Monthly Income and Profit Chart of {new Date().getFullYear()}</h2>
				<IncomeProfitChart data={incomeProfitData} />
			</>
		),
		"Monthly Orders": (
			<>
				<h2>Monthly Orders Chart of {new Date().getFullYear()}</h2>
				<MonthlyOrdersChart data={monthlyOrdersData}/>
			</>
		),
	};

	const [activeTabKey2, setActiveTabKey2] = useState("Financial");

	const onTab2Change = (key) => {
		setActiveTabKey2(key);
	};

	if (loading) return <p>Loading...</p>;
	if (!incomeProfitData) return <p>No data available</p>;

	return (
		<Col
			xs={{
				flex: "10%",
			}}
			sm={{
				flex: "20%",
			}}
			md={{
				flex: "30%",
			}}
			lg={{
				flex: "50%",
			}}
			xl={{
				flex: "70%",
			}}>
			<Card
				style={{ width: "100%", height: "100%" }}
				hoverable
				tabList={tabListNoTitle}
				activeTabKey={activeTabKey2}
				onTabChange={onTab2Change}
				tabProps={{
					size: "large",
				}}>
				{contentListNoTitle[activeTabKey2]}
			</Card>
		</Col>
	);
};

export default GraphStat;
