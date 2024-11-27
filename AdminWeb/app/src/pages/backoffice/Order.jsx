import { useEffect, useState, useRef } from "react";
import Highlighter from "react-highlight-words";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

import { Select, Input, Tag, Space, Table, Button, Image, Flex, DatePicker } from "antd";
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

dayjs.extend(buddhistEra);

function Order() {
	const [orderList, setOrderList] = useState([]);
	const [order, setOrder] = useState({});

	const [selectedStatus, setSelectedStatus] = useState();
	const statusConfig = {
		"To be paid": { color: "orange", icon: <QuestionCircleOutlined />, statusDetail: "Please transfer money to the bank account below" },
		Paid: { color: "lime", icon: <InfoCircleOutlined />, statusDetail: "Payment has been received, wait for admin checking" },
		Problem: { color: "volcano", icon: <WarningOutlined />, statusDetail: "There is a problem with the order, please contact admin" },
		"In Progress": { color: "blue", icon: <LoadingOutlined />, statusDetail: "Confirmed your payment, your order is being processed" },
		Shipped: { color: "purple", icon: <SendOutlined />, statusDetail: "The order has shipped, you can follow up with the parcel code" },
		Completed: { color: "green", icon: <CheckCircleOutlined />, statusDetail: "The order has been completed, thank you for shopping with us" },
		Cancelled: { color: "red", icon: <CloseCircleOutlined />, statusDetail: "The order has been cancelled" },
	};

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
			render: (orderDate) => dayjs(orderDate).format("YYYY/MM/DD HH:mm:ss"),
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
			render: (paymentDate) => (paymentDate ? dayjs(paymentDate).format("YYYY/MM/DD HH:mm:ss") : null),
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
			title: "Status & Modify",
			dataIndex: "status",
			key: "status",
			className: "text-center",
			width: 150,
			fixed: "right",
			render: (status, record) => {
				const { color = "default", icon = <></> } = statusConfig[status] || {};
				return (
					<>
						<Tag
							className="col p-1 text-center hoverable-tag"
							style={{ "--color": color }}
							icon={icon}
							color={color}
							data-toggle="modal"
							data-target="#modalOrderStatus"
							onClick={() => {
								clearForm();
								setOrder(record);
								setSelectedStatus(record.status);
								record.paymentSlipIMG === null ? setIsChangeIMG(true) : setIsChangeIMG(false);
							}}>
							{status.toUpperCase()}
						</Tag>
						<button
							id="editButton"
							className="btn btn-primary mt-2"
							style={{
								width: "40px",
								height: "40px",
							}}
							data-toggle="modal"
							data-target="#modalOrderInfo"
							onClick={() => {
								clearForm();
								setOrder(record);
							}}>
							<i className="ion-edit" style={{ fontSize: "18px" }}></i>
						</button>
					</>
				);
			},
			filters: [
				{
					text: "To be paid",
					value: "To be paid",
				},
				{
					text: "Paid",
					value: "Paid",
				},
				{
					text: "Problem",
					value: "Problem",
				},
				{
					text: "In Progress",
					value: "In Progress",
				},
				{
					text: "Shipped",
					value: "Shipped",
				},
				{
					text: "Completed",
					value: "Completed",
				},
				{
					text: "Cancelled",
					value: "Cancelled",
				},
			],
			filterSearch: true,
			onFilter: (value, record) => record.status.includes(value) === true,
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
			title: "Book Name",
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

	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const [img, setImg] = useState(null);
	const refImg = useRef();
	const [isChangeIMG, setIsChangeIMG] = useState(true);
	const selectedFile = (inputFile) => {
		if (inputFile !== undefined && inputFile.length > 0) {
			setImg(inputFile[0]);
		}
	};
	const handleUpload = async () => {
		try {
			if (!img) return null;
			const formData = new FormData();
			formData.append("img", img);

			const result = await axios.post(config.apiPath + "/order/uploadPaymentSlip", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: localStorage.getItem("token"),
				},
			});

			if (result.data.newName !== undefined) {
				return result.data.newName;
			}
		} catch (e) {
			Swal.fire({
				title: "Error",
				text: e.message,
				icon: "error",
				confirmButtonColor: "#dc3545",
			});
			return null;
		}
	};

	const handleSave = async (mode) => {
		try {
			// Validate
			let errorList = [];
			if (mode === "status") {
				order.status = selectedStatus;
				order.statusDetail = order.statusDetail ? order.statusDetail : statusConfig[selectedStatus].statusDetail;

				if (selectedStatus === "Paid") {
					if (order.paymentDate === null) errorList["paymentDate"] = true;
					if (isChangeIMG && !img) errorList["paymentSlipIMG"] = true;

					if (Object.keys(errorList).length > 0) {
						setErrorForm((prev) => ({
							...prev,
							...errorList,
						}));
						return;
					}

					order.paymentDate = new Date(order.paymentDate).toISOString();
					if (isChangeIMG) {
						order.paymentSlipIMG = await handleUpload();
						order.deleteIMG = true;
					} else {
						order.deleteIMG = false;
					}
				} else if (selectedStatus === "Shipped") {
					if (!order.parcelCode) errorList["parcelCode"] = true;

					if (Object.keys(errorList).length > 0) {
						setErrorForm((prev) => ({
							...prev,
							...errorList,
						}));
						return;
					}
				}
			} else {
				// mode === "info"
				if (!order.address) errorList["address"] = true;
				if (!order.phone || order.phone.length !== 10 || !/^\d+$/.test(order.phone) || order.phone[0] !== "0") errorList["phone"] = true;

				if (Object.keys(errorList).length > 0) {
					setErrorForm((prev) => ({
						...prev,
						...errorList,
					}));
					return;
				}
			}

			const result = await axios.put(config.apiPath + "/order/orderUpdate/", order, config.headers());

			if (result.data.message === "success") {
				Swal.fire({
					title: "Add product",
					text: "Order saved successfully",
					icon: "success",
					timer: 2000, //2 sec.
				});
				fetchData();
				document.getElementById("modalOrderStatus_btnClose").click();
				document.getElementById("modalOrderInfo_btnClose").click();
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

	const [errorForm, setErrorForm] = useState({
		address: false,
		phone: false,
		pacelCode: false,
		paymentDate: false,
		paymentSlipIMG: false,
	});
	const clearErrorBorder = (e) => {
		setErrorForm((prev) => ({
			...prev,
			[e]: false,
		}));
	};
	const clearForm = () => {
		setImg(null);
		if (refImg.current) {
			refImg.current.value = "";
		}
		setErrorForm({
			address: false,
			phone: false,
			parcelCode: false,
			paymentDate: false,
			paymentSlipIMG: false,
		});
	};

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
					position: ["bottomLeft"],
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

			<MyModal id="modalOrderStatus" title={`Manage status for OrderID: ${order.id}`}>
				<div className="row">
					<div className="col mb-2" style={{ fontWeight: "bold" }}>
						Select order status:
					</div>
				</div>

				<Select
					id="selectStatus"
					style={{ width: "100%" }}
					value={selectedStatus}
					onChange={(value) => {
						setSelectedStatus(value);
						setOrder({ ...order, statusDetail: statusConfig[value].statusDetail });
					}}>
					<Select.Option value="To be paid">To be paid</Select.Option>
					<Select.Option value="Paid">Paid</Select.Option> {/*For admin selected must input payment slip and payment date*/}
					<Select.Option value="Problem">Problem</Select.Option> {/*For admin selected must input problem detail*/}
					<Select.Option value="In Progress">In Progress</Select.Option>
					<Select.Option value="Shipped">Shipped</Select.Option> {/*For admin selected must input parcel code*/}
					<Select.Option value="Completed">Completed</Select.Option>
					<Select.Option value="Cancelled">Cancelled</Select.Option>
				</Select>

				<div id="editStatusDetail" className="row mt-2">
					<div className="col mb-2" style={{ fontWeight: "bold" }}>
						Status detail:
					</div>
				</div>

				<TextArea
					rows={2}
					allowClear
					value={order.statusDetail}
					onChange={(e) =>
						setOrder({
							...order,
							statusDetail: e.target.value,
						})
					}
				/>

				{selectedStatus === "Paid" && (
					<>
						<div className="row mt-2">
							<div className="col mb-2" style={{ fontWeight: "bold" }}>
								Select payment date:
							</div>
						</div>
						<DatePicker
							allowClear={false}
							status={errorForm["paymentDate"] ? "error" : ""}
							showTime
							showNow
							defaultValue={order.paymentDate ? dayjs(order.paymentDate) : null}
							open={isDatePickerOpen}
							onFocus={() => {
								clearErrorBorder("paymentDate");
								setIsDatePickerOpen(true);
							}}
							onChange={(_, dateString) => {
								setOrder({
									...order,
									paymentDate: dateString,
								});
							}}
							onOk={() => {
								setIsDatePickerOpen(false);
							}}
						/>
						<div className={`mt-2 ${isChangeIMG ? "" : "text-center"}`}>
							<div style={{ fontWeight: "bold" }}>Payment slip image:</div>
							{isChangeIMG ? (
								<Input
									className="mt-1"
									type="file"
									ref={refImg}
									onChange={(e) => selectedFile(e.target.files)}
									status={errorForm["paymentSlipIMG"] ? "error" : ""}
									onFocus={() => {
										clearErrorBorder("paymentSlipIMG");
									}}
								/>
							) : (
								<div ref={refImg}></div>
							)}

							{!isChangeIMG && (
								<div class="container containerIMG mt-1" onClick={async () => await setIsChangeIMG(true)}>
									<Image
										className="imageProduct"
										height={200}
										width="full"
										src={config.apiPath + "/uploads/payment_slip_img/" + order.paymentSlipIMG}
										fallback="default_img.webp"
										preview={false}
									/>
									<div class="middle textIMG">
										<i className="fas fa-trash-alt"></i>
										<div>Click to Remove</div>
									</div>
								</div>
							)}
						</div>
					</>
				)}

				{selectedStatus === "Shipped" && (
					<>
						<div className="row mt-2">
							<div className="col mb-2" style={{ fontWeight: "bold" }}>
								Pacel code:
							</div>
						</div>
						<Input
							type="text"
							status={errorForm["parcelCode"] ? "error" : ""}
							value={order.parcelCode}
							allowClear
							onChange={(e) =>
								setOrder({
									...order,
									parcelCode: e.target.value,
								})
							}
							onKeyDown={() => clearErrorBorder("parcelCode")}
						/>
					</>
				)}

				<div className="text-right mt-3">
					<button
						className="btn btn-primary font-weight-bold"
						onClick={() => {
							handleSave("status");
						}}>
						<i className="fa fa-save mr-2"></i>
						Save
					</button>
				</div>
			</MyModal>

			<MyModal id="modalOrderInfo" title={`Manage info for OrderID: ${order.id}`}>
				<div id="editAddress" className="mb-3">
					<label className="form-label">Address</label>
					<TextArea
						rows={5}
						status={errorForm["address"] ? "error" : ""}
						value={order.address}
						allowClear
						onChange={(e) =>
							setOrder({
								...order,
								address: e.target.value,
							})
						}
						onKeyDown={() => clearErrorBorder("address")}
					/>
				</div>

				<div id="editPhone" className="mb-3">
					<label className="form-label">Phone</label>
					<Input
						type="text"
						maxLength={10}
						minLength={10}
						status={errorForm["phone"] ? "error" : ""}
						value={order.phone}
						allowClear
						onChange={(e) =>
							setOrder({
								...order,
								phone: e.target.value,
							})
						}
						onKeyDown={() => clearErrorBorder("phone")}
					/>
				</div>

				<div className="text-right mt-3">
					<button
						className="btn btn-primary font-weight-bold"
						onClick={() => {
							handleSave("info");
						}}>
						<i className="fa fa-save mr-2"></i>
						Save
					</button>
				</div>
			</MyModal>
		</BackOffice>
	);
}

export default Order;
