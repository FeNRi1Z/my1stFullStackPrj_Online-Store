import React, { useEffect, useState } from "react";

import axios from "axios";
import { Col, Row, Card, message, Typography, Popover, Statistic, ConfigProvider, Button, List, Tag } from "antd";
import {
	TeamOutlined,
	UserOutlined,
	UserDeleteOutlined,
	BookOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	ShoppingOutlined,
	QuestionCircleOutlined,
	InfoCircleOutlined,
	WarningOutlined,
	LoadingOutlined,
	SendOutlined,
	RiseOutlined,
} from "@ant-design/icons";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

import config from "../../config";
import BackOffice from "../../components/BackOffice";
import TopSellingProducts from "../../components/TopProductInMonth";
import GraphStat from "../../components/GraphStat";

const { Text } = Typography;
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

axios.interceptors.response.use(
	(response) => response, // Return the response normally if successful
	(error) => {
		if (error.response && error.response.status === 401) {
			// Automatically redirect to sign in page if 401 Unauthorized is returned
			window.location.href = "/";
		}
		return Promise.reject(error);
	}
);

function Home() {
	const [userCardData, setUserCardData] = useState({}); // userCardData = {activeUsers: 0, inactiveUsers: 0, totalUsers: 0}
	const [orderCardData, setOrderCardData] = useState({}); // orderCardData = {totalOrders: 0, todayOrders: 0, ordersByStatus: []}
	const [financialCardData, setFinancialCardData] = useState({}); // financialCardData = {totalIncome: 0, totalProfit: 0}
	const [productCardData, setProductCardData] = useState({}); // productCardData = {activeProducts: 0, inactiveProducts: 0, totalProducts: 0, outOfStock: 0, outOfStockProducts: []}
	/*
		Data for product card chart extends from productCardData
	*/
	const chartData = {
		labels: ["Active", "Inactive"],
		datasets: [
			{
				data: [productCardData.activeProducts, productCardData.inactiveProducts],
				backgroundColor: ["#245501", "#d90429"],
				borderWidth: 1,
			},
		],
	};

	const [isOutOfStockOpen, setIsOutOfStockOpen] = useState(false);

	/*
		Fetch data from API and set to state for all cards statistic
	*/
	const fetchData = async () => {
		try {
			const user = await axios.get(config.apiPath + "/user/stat/card", config.headers());
			if (user.status === 200) {
				setUserCardData(user.data);
			} else {
				throw new Error("Failed to fetch user card data");
			}

			const product = await axios.get(config.apiPath + "/product/stat/card", config.headers());
			if (product.status === 200) {
				setProductCardData(product.data);
			} else {
				throw new Error("Failed to fetch product card data");
			}

			const order = await axios.get(config.apiPath + "/order/stat/card", config.headers());
			if (order.status === 200) {
				setOrderCardData(order.data);
			} else {
				throw new Error("Failed to fetch order card data");
			}

			const financial = await axios.get(config.apiPath + "/order/stat/financial", config.headers());
			if (financial.status === 200) {
				setFinancialCardData(financial.data);
			} else {
				throw new Error("Failed to fetch financial data");
			}
		} catch (e) {
			message.error(e.message);
		}
	};

	useEffect(() => {
		fetchData();
		return () => {
			fetchData();
		};
	}, []);

	/* 
	userCard statistic function is a card that shows the total number of users, active users, and inactive users.
*/
	const userCard = () => {
		return (
			<ConfigProvider
				theme={{
					components: {
						Card: {
							headerFontSize: "20px",
						},
					},
				}}>
				<Popover
					placement="bottom"
					content={
						<Row gutter={16}>
							<Col span={"100%"}>
								<Card bordered={true}>
									<Statistic
										title="Active"
										value={userCardData.activeUsers}
										valueStyle={{
											color: "#245501",
										}}
										prefix={<UserOutlined />}
										suffix="account"
									/>
								</Card>
							</Col>
							<Col span={"100%"}>
								<Card bordered={true}>
									<Statistic
										title="Inactive"
										value={userCardData.inactiveUsers}
										valueStyle={{
											color: "#d90429",
										}}
										prefix={<UserDeleteOutlined />}
										suffix="account"
									/>
								</Card>
							</Col>
						</Row>
					}>
					<Card hoverable={true} title="Total User">
						<Card.Meta
							avatar={<TeamOutlined style={{ fontSize: "80px", color: "#d90429" }} />}
							description={
								<>
									<Row justify="space-between" align="middle" style={{ padding: "10px 0" }}>
										<Col offset={5} style={{ textAlign: "left" }}>
											<Text strong style={{ fontSize: "50px" }}>
												{userCardData.totalUsers}
											</Text>
										</Col>
										<Col style={{ textAlign: "right" }}>
											<Text style={{ fontSize: "20px" }}>Account</Text>
										</Col>
									</Row>
									<Row justify={"center"}>
										<i className="fas fa-arrow-down" style={{ fontSize: "15px", color: "#d90429", fontWeight: "bold" }} />
										<div style={{ width: "97px" }}></div>
									</Row>
								</>
							}
						/>
					</Card>
				</Popover>
			</ConfigProvider>
		);
	};
	/* 
	productCard statistic function is a card that shows the total number of products, active products, inactive products, out of stock products, and a pie chart that shows the percentage of active and inactive products.
*/
	const productCard = () => {
		return (
			<ConfigProvider
				theme={{
					components: {
						Card: {
							headerFontSize: "20px",
						},
					},
				}}>
				<Popover
					placement="bottom"
					content={
						<div style={{ width: "200px", height: "200px", margin: "auto" }}>
							<Pie
								data={chartData}
								options={{
									plugins: {
										legend: {
											position: "bottom",
										},
										tooltip: {
											callbacks: {
												label: (tooltipItem) => `${chartData.labels[tooltipItem.dataIndex]}: ${chartData.datasets[0].data[tooltipItem.dataIndex]}`,
											},
										},
										datalabels: {
											color: "#ffffff",
											font: {
												size: 20,
												weight: "bold",
											},
											formatter: (value, context) => {
												return value;
											},
										},
									},
								}}
							/>
						</div>
					}>
					<Card
						hoverable={true}
						title="Total Product"
						extra={
							productCardData.outOfStock > 0 ? (
								<Popover
									content={
										<>
											<div>{productCardData.outOfStockProducts.map((product) => product).join(", ")}</div>
										</>
									}
									title="The following products ID are out of stock!"
									trigger="click"
									open={isOutOfStockOpen}
									onOpenChange={(e) => setIsOutOfStockOpen(e)}>
									<Button type="default" danger style={{ fontWeight: "bold", color: "#d90429" }}>
										{productCardData.outOfStock} Out of Stock
									</Button>
								</Popover>
							) : null
						}>
						<Card.Meta
							avatar={<BookOutlined style={{ fontSize: "80px", color: "#fca311" }} />}
							description={
								<>
									<Row justify="space-between" align="middle" style={{ padding: "10px 0" }}>
										<Col offset={5} style={{ textAlign: "left" }}>
											<Text strong style={{ fontSize: "50px" }}>
												{productCardData.totalProducts}
											</Text>
										</Col>
										<Col style={{ textAlign: "right" }}>
											<Text style={{ fontSize: "20px" }}>Product</Text>
										</Col>
									</Row>
									<Row justify={"center"}>
										<i className="fas fa-arrow-down" style={{ fontSize: "15px", color: "#fca311", fontWeight: "bold" }} />
										<div style={{ width: "97px" }}></div>
									</Row>
								</>
							}
						/>
					</Card>
				</Popover>
			</ConfigProvider>
		);
	};
	/* 
	orderCard statistic function is a card that shows the total number of orders, orders for today, and the number of orders by status.
*/
	const orderCard = () => {
		const getOrderCountByStatus = (status) => {
			const statusObj = orderCardData.ordersByStatus.find((item) => item.status === status);
			return statusObj ? statusObj._count : 0;
		};

		const statusList = ["To be paid", "Paid", "Problem", "In Progress", "Shipped", "Completed", "Cancelled"];

		const statusConfig = {
			"To be paid": { color: "orange", icon: <QuestionCircleOutlined />, statusDetail: "Please transfer money to the bank account below" },
			Paid: { color: "lime", icon: <InfoCircleOutlined />, statusDetail: "Payment has been received, wait for admin checking" },
			Problem: { color: "volcano", icon: <WarningOutlined />, statusDetail: "There is a problem with the order, please contact admin" },
			"In Progress": { color: "blue", icon: <LoadingOutlined />, statusDetail: "Confirmed your payment, your order is being processed" },
			Shipped: { color: "purple", icon: <SendOutlined />, statusDetail: "The order has shipped, you can follow up with the parcel code" },
			Completed: { color: "green", icon: <CheckCircleOutlined />, statusDetail: "The order has been completed, thank you for shopping with us" },
			Cancelled: { color: "red", icon: <CloseCircleOutlined />, statusDetail: "The order has been cancelled" },
		};

		return (
			<ConfigProvider
				theme={{
					components: {
						Card: {
							headerFontSize: "20px",
						},
					},
				}}>
				<Popover
					placement="bottom"
					content={
						<>
							<List
								style={{ width: "250px" }}
								itemLayout="horizontal"
								dataSource={statusList}
								renderItem={(item) => {
									const { color = "default", icon = <></> } = statusConfig[item] || {};
									return (
										<List.Item>
											<Row style={{ width: "100%" }} justify={"space-between"}>
												<Col span={"100px"}>
													<Tag className="p-1 text-center" style={{ fontWeight: "bolder", width: "120px" }} icon={icon} color={color}>
														{item.toUpperCase()}
													</Tag>
												</Col>
												<Col span={"100px"} align={"center"}>
													<div style={{ fontWeight: "bold", fontSize: "18px" }}>{getOrderCountByStatus(item)}</div>
												</Col>
												<Col span={"100px"} align={"center"}>
													<div style={{ fontSize: "18px" }}>Order</div>
												</Col>
											</Row>
										</List.Item>
									);
								}}
							/>
						</>
					}>
					<Card hoverable={true} title="Total Order" extra={<Text style={{ fontWeight: "bold", color: "#00a6fb" }}>{orderCardData.todayOrders} Order for today</Text>}>
						<Card.Meta
							avatar={<ShoppingOutlined style={{ fontSize: "80px", color: "#00a6fb" }} />}
							description={
								<>
									<Row justify="space-between" align="middle" style={{ padding: "10px 0" }}>
										<Col offset={5} style={{ textAlign: "left" }}>
											<Text strong style={{ fontSize: "50px" }}>
												{orderCardData.totalOrders}
											</Text>
										</Col>
										<Col style={{ textAlign: "right" }}>
											<Text style={{ fontSize: "20px" }}>Order</Text>
										</Col>
									</Row>
									<Row justify={"center"}>
										<i className="fas fa-arrow-down" style={{ fontSize: "15px", color: "#00a6fb", fontWeight: "bold" }} />
										<div style={{ width: "97px" }}></div>
									</Row>
								</>
							}
						/>
					</Card>
				</Popover>
			</ConfigProvider>
		);
	};
	/*
	financialCard statistic function is a card that shows the total income and total profit.
*/
	const financialCard = () => {
		return (
			<ConfigProvider
				theme={{
					components: {
						Card: {
							headerFontSize: "20px",
						},
					},
				}}>
				<Card hoverable={true} title="Total financial">
					<Card.Meta
						avatar={<RiseOutlined style={{ fontSize: "80px", color: "#245501" }} />}
						description={
							<>
								<Row justify="space-between" align="middle" style={{ padding: "0 0" }}>
									<Col offset={3} style={{ textAlign: "right" }}>
										<Text style={{ fontSize: "20px", fontWeight: "bold" }}>Income</Text>
									</Col>
									<Col offset={1} style={{ textAlign: "left" }}>
										<Text strong style={{ fontSize: "31.3px", fontWeight: "bolder" }}>
											{financialCardData.totalIncome}$
										</Text>
									</Col>
								</Row>
								<Row justify="space-between" align="middle" style={{ padding: "0 0" }}>
									<Col offset={3} style={{ textAlign: "right" }}>
										<Text style={{ fontSize: "20px", fontWeight: "bold" }}>Profit</Text>
									</Col>
									<Col offset={1} style={{ textAlign: "left" }}>
										<Text strong style={{ fontSize: "31.5px", fontWeight: "bolder" }}>
											{financialCardData.totalProfit}$
										</Text>
									</Col>
								</Row>
								<Row justify={"center"}>
									<i className="fas fa-line" style={{ fontSize: "15px", color: "#245501", fontWeight: "bold" }} />
									<div style={{ width: "97px" }}></div>
								</Row>
							</>
						}
					/>
				</Card>
			</ConfigProvider>
		);
	};

	return (
		<BackOffice>
			<div className="mb-3">
				<div className="h5" style={{ fontWeight: "bold" }}>
					Mod-Ed Dashboard
				</div>
			</div>
			<div>
				<Row gutter={20}>
					<Col xs={2} sm={4} md={6}>
						{userCard()}
					</Col>
					<Col xs={2} sm={4} md={6}>
						{productCard()}
					</Col>
					<Col xs={2} sm={4} md={6}>
						{orderCard()}
					</Col>
					<Col xs={2} sm={4} md={6}>
						{financialCard()}
					</Col>
				</Row>
				<Row gutter={20} wrap={false} className="mt-3" justify={"space-between"}>
					<GraphStat />
					<Col xs={{ flex: "5%" }} sm={{ flex: "10%" }} md={{ flex: "15%" }} lg={{ flex: "20%" }} xl={{ flex: "34%" }}>
						<Card style={{ width: "98%", height: "100%" }} hoverable={true}>
							<TopSellingProducts />
						</Card>
					</Col>
				</Row>
			</div>
		</BackOffice>
	);
}

export default Home;
