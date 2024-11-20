import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import { Select, Input, Tag, Space, Table, Button, Image, Flex } from "antd";
import { createStyles } from "antd-style";
import {
	SearchOutlined,
	LoadingOutlined,
	QuestionCircleOutlined,
	InfoCircleOutlined,
	SendOutlined,
	CheckCircleOutlined,
	CloseCircleOutlined,
	PlusCircleTwoTone,
	MinusCircleTwoTone,
	WarningOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import config from "../../config";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import "../../styles/HoverTag.css";

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

const { TextArea } = Input;

function Order() {
	const [orderList, setOrderList] = useState([]);
	const [order, setOrder] = useState({});

	const [selectedStatus, setSelectedStatus] = useState();

	const fetchData = async () => {
		try {
			const orderListResult = await axios.get(config.apiPath + "/order/orderList/", config.headers());
			if (orderListResult.data.results !== undefined) {
				setOrderList(orderListResult.data.results);
			}
		} catch (e) {
			Swal.fire({
				title: "Error!",
				text: e.message,
				icon: "error",
				confirmButtonColor: "#dc3545",
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button type="primary" onClick={() => handleSearch(selectedKeys, confirm, dataIndex)} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>
						Search
					</Button>
					<Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}>
						Close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1677ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		filterDropdownProps: {
			onOpenChange(open) {
				if (open) setTimeout(() => searchInput.current?.select(), 100);
			},
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#ffc069",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});
	const useStyle = createStyles(({ css, token }) => {
		const { antCls } = token;
		return {
			customTable: css`
				${antCls}-table {
					${antCls}-table-container {
						${antCls}-table-body,
						${antCls}-table-content {
							scrollbar-width: thin;
							scrollbar-color: #eaeaea transparent;
							scrollbar-gutter: stable;
						}
					}
				}
			`,
		};
	});
	const { styles } = useStyle();
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
			className: "text-center",
			width: 70,
			fixed: "left",
			...getColumnSearchProps("id"),
			sorter: (a, b) => a.id - b.id,
			sortDirections: ["descend", "ascend"],
		},
		Table.EXPAND_COLUMN,
		{
			title: "Order Date",
			dataIndex: "orderDate",
			key: "orderDate",
			width: 100,
			...getColumnSearchProps("orderDate"),
			sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "UserID",
			dataIndex: "userId",
			key: "userId",
			className: "text-center",
			width: 100,
			...getColumnSearchProps("userId"),
			sorter: (a, b) => a.userId - b.userId,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Name",
			dataIndex: "userName",
			key: "userName",
			width: 200,
			...getColumnSearchProps("userName"),
		},
		{
			title: "Address",
			dataIndex: "address",
			key: "address",
			width: 300,
			...getColumnSearchProps("address"),
		},
		{
			title: "Phone",
			dataIndex: "phone",
			key: "phone",
			width: 90,
			...getColumnSearchProps("phone"),
		},
		{
			title: "Order Total",
			dataIndex: "orderTotal",
			key: "orderTotal",
			width: 100,
			...getColumnSearchProps("orderTotal"),
			sorter: (a, b) => a.orderTotal - b.orderTotal,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Payment Date",
			dataIndex: "paymentDate",
			key: "paymentDate",
			width: 110,
			...getColumnSearchProps("paymentDate"),
			sorter: (a, b) => new Date(a.paymentDate) - new Date(b.paymentDate),
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Payment Slip",
			dataIndex: "paymentSlipIMG",
			key: "paymentSlipIMG",
			className: "text-center",
			width: 100,
			render: (paymentSlipIMG) => <Image height={100} width={"full"} src={config.apiPath + "/uploads/payment_slip_img/" + paymentSlipIMG} fallback="default_img.webp" />,
		},
		{
			title: "Parcel Code",
			dataIndex: "parcelCode",
			key: "parcelCode",
			width: 150,
		},
		{
			title: "Status Detail",
			dataIndex: "statusDetail",
			key: "statusDetail",
			width: 200,
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			className: "text-center",
			width: 150,
			fixed: "right",
			render: (status, record) => {
				const statusConfig = {
					"To be paid": { color: "orange", icon: <QuestionCircleOutlined /> },
					Paid: { color: "lime", icon: <InfoCircleOutlined /> },
					Problem: { color: "volcano", icon: <WarningOutlined /> },
					Shipping: { color: "purple", icon: <SendOutlined /> },
					Completed: { color: "green", icon: <CheckCircleOutlined /> },
					Cancelled: { color: "red", icon: <CloseCircleOutlined /> },
				};
				const { color = "blue", icon = <LoadingOutlined /> } = statusConfig[status] || {};
				return (
					<>
						<Tag
							className="col p-1 text-center hoverable-tag"
							style={{ "--color": color }}
							icon={icon}
							color={color}
							data-toggle="modal"
							data-target="#modalOrder"
							onClick={() => {
								setOrder(record);
								setSelectedStatus(record.status);
							}}>
							{status.toUpperCase()}
						</Tag>
					</>
				);
			},
		},
	];
	const expandColumns = [
		{
			title: "ID",
			dataIndex: "productId",
			key: "productId",
			className: "text-center",
			width: 70,
			fixed: "left",
			...getColumnSearchProps("productId"),
			sorter: (a, b) => a.productId - b.productId,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Cover",
			dataIndex: "img",
			key: "img",
			className: "text-center",
			width: 100,
			render: (img) => <Image height={100} width={"full"} src={config.apiPath + "/uploads/product_img/" + img} fallback="default_img.webp" />,
		},
		{
			fixed: "left",
			width: "150px",
			title: "Name",
			dataIndex: "name",
			key: "name",
			...getColumnSearchProps("name"),
		},
		{
			width: "300px",
			title: "Description",
			dataIndex: "desc",
			key: "desc",
			...getColumnSearchProps("desc"),
		},
		{
			width: "100px",
			title: "Author",
			dataIndex: "author",
			key: "author",
			...getColumnSearchProps("author"),
		},
		{
			width: "250px",
			title: "Categories",
			dataIndex: "categoriesName",
			key: "categoriesName",
			...getColumnSearchProps("categoriesName"),
			sorter: (a, b) => a.categoriesName.length - b.categoriesName.length,
			sortDirections: ["descend", "ascend"],
			render: (tags) => (
				<Flex wrap gap="0.01px">
					{tags.map((tag) => {
						return (
							<Tag color={"geekblue"} key={tag} style={{ color: "black" }}>
								{tag}
							</Tag>
						);
					})}
				</Flex>
			),
		},
		{
			width: "110px",
			title: "Price",
			dataIndex: "productPrice",
			key: "productPrice",
			...getColumnSearchProps("productPrice"),
			sorter: (a, b) => a.productPrice - b.productPrice,
			sortDirections: ["descend", "ascend"],
		},
		{
			width: "110px",
			title: "Quantity",
			dataIndex: "quantity",
			key: "quantity",
			...getColumnSearchProps("quantity"),
			sorter: (a, b) => a.quantity - b.quantity,
			sortDirections: ["descend", "ascend"],
		},
		{
			title: "Total Price",
			dataIndex: "totalPrice",
			key: "totalPrice",
			width: 100,
			...getColumnSearchProps("totalPrice"),
			sorter: (a, b) => a.totalPrice - b.totalPrice,
			sortDirections: ["descend", "ascend"],
		},
	];
	const expandedRowRender = (record) => (
		<Table
			columns={expandColumns}
			dataSource={record.orderItems}
			pagination={false}
			className={styles.customTable}
			size="small"
			sticky
			bordered={true}
			scrollToFirstRowOnChange={true}
			scroll={{
				x: "max-content",
				y: 5 * 50,
			}}
		/>
	);

	return (
		<BackOffice>
			<div className="mb-3">
				<div className="h5" style={{ fontWeight: "bold" }}>
					Order Manager
				</div>
			</div>
			<Table
				id="orderTable"
				className={styles.customTable}
				size="small"
				sticky
				bordered={true}
				columns={columns}
				dataSource={orderList}
				scrollToFirstRowOnChange={true}
				scroll={{
					x: "max-content",
					y: "max-content",
				}}
				pagination={{
					pageSize: 10,
					hideOnSinglePage: false,
				}}
				rowKey={(record) => record.id}
				expandable={{
					expandedRowRender,
					columnTitle: "Order Items",
					columnWidth: 55,
					fixed: "left",
					expandIcon: ({ expanded, onExpand, record }) => {
						return expanded ? <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} /> : <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />;
					},
				}}
			/>

			<MyModal id="modalOrder" title={`Manage Order ID: ${order.id}`}>
				<div className="row">
					<div className="col mb-2" style={{ fontWeight: "bold" }}>
						Select order status:
					</div>
				</div>

				<Select
					style={{ width: "100%" }}
					value={selectedStatus}
					onChange={(value) => {
						setSelectedStatus(value);
					}}>
					<Select.Option value="To be paid">To be paid</Select.Option>
					<Select.Option value="Paid">Paid</Select.Option> {/*For admin selected must input payment slip and payment date*/}
					<Select.Option value="Problem">Problem</Select.Option> {/*For admin selected must input problem detail*/}
					<Select.Option value="In Progress">In Progress</Select.Option>
					<Select.Option value="Sent">Sent</Select.Option> {/*For admin selected must input parcel code*/}
					<Select.Option value="Complete">Complete</Select.Option>
					<Select.Option value="Cancelled">Cancelled</Select.Option>
				</Select>

				<div id="editStatusDetail" className="row">
					<div className="col mb-2" style={{ fontWeight: "bold" }}>
						Status detail:
					</div>
				</div>

				<TextArea
					rows={3}
					allowClear
					value={order.statusDetail}
					onChange={(e) =>
						setOrder({
							...order,
							statusDetail: e.target.value,
						})
					}
				/>

				{selectedStatus === "Paid" && <div></div>}

				<div className="text-right mt-3">
					<button className="btn btn-primary font-weight-bold" onClick={() => {}}>
						<i className="fa fa-save mr-2"></i>
						Save
					</button>
				</div>
			</MyModal>
		</BackOffice>
	);
}

export default Order;
