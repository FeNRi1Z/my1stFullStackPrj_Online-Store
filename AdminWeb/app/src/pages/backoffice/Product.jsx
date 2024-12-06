import { useEffect, useState, useRef } from "react";

import Swal from "sweetalert2";
import axios from "axios";
import { Select, Input, Tag, Flex, Table, Image } from "antd";

import config from "../../config";
import BackOffice from "../../components/BackOffice";
import MyModal from "../../components/MyModal";
import SearchColumn from "../../components/AntTableSearchHandle";
import { useCustomTableStyle } from "../../components/AntTableStyleHandle";
import "../../styles/HoverProductIMG.css";

const { TextArea } = Input;

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

function Product() {
	const [products, setProducts] = useState([]); //fetched product data
	const [product, setProduct] = useState({}); //for new product adding holder

	const [img, setImg] = useState(); //file upload
	const refImg = useRef(); //ref for file upload

	const [isEdit, setIsEdit] = useState(false); //for Product modal text display
	const [isRemoveIMG, setIsRemoveIMG] = useState(false); //for remove image status

	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");

	const getColumnSearchProps = (dataIndex) => SearchColumn({ dataIndex: dataIndex, setSearchText, setSearchedColumn, searchText, searchedColumn });
	const { styles } = useCustomTableStyle();
	/*
		// columns setup for main table
	*/
	const columns = [
		{
			width: "100px",
			title: "Cover",
			dataIndex: "img",
			key: "img",
			className: "text-center",
			render: (img) => <Image height={100} width={"full"} src={config.apiPath + "/uploads/product_img/" + img} fallback="default_img.webp" />,
		},
		{
			fixed: "left",
			width: "65px",
			title: "ID",
			dataIndex: "id",
			key: "id",
			...getColumnSearchProps("id"),
			sorter: (a, b) => a.id - b.id,
			sortDirections: ["descend", "ascend"],
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
			title: "Cost",
			dataIndex: "cost",
			key: "cost",
			...getColumnSearchProps("cost"),
			sorter: (a, b) => a.cost - b.cost,
			sortDirections: ["descend", "ascend"],
		},
		{
			width: "110px",
			title: "Price",
			dataIndex: "price",
			key: "price",
			...getColumnSearchProps("price"),
			sorter: (a, b) => a.price - b.price,
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
			fixed: "right",
			width: "110px",
			title: "Modify",
			dataIndex: "id",
			key: "modify",
			render: (_, record) => (
				<div className="text-center">
					<button
						className="btn btn-primary mr-2"
						style={{ width: "40px", height: "40px" }}
						data-toggle="modal"
						data-target="#modalProduct"
						onClick={async () => {
							setIsEdit(true);
							clearErrorForm();
							clearForm();
							setSelectedAuthor(record.authorId);
							setSelectedCategory(record.categories);
							setProduct(record);
							record.img === "noIMGFile" ? await setIsRemoveIMG(true) : await setIsRemoveIMG(false);
						}}>
						<i className="ion-edit" style={{ fontSize: "15px" }}></i>
					</button>
					<button className="btn btn-danger" style={{ width: "40px", height: "40px" }} onClick={() => handleRemove(record)}>
						<i className="ion-android-delete" style={{ fontSize: "18px" }}></i>
					</button>
				</div>
			),
		},
	];

	const [authors, setAuthors] = useState([]); //fetched author data
	const [selectedAuthor, setSelectedAuthor] = useState(); //for author selection
	const [isNewAuthor, setIsNewAuthor] = useState(false); //for new author adding status holder

	const [categories, setCategories] = useState([]); //fetched category data
	const [selectedCategory, setSelectedCategory] = useState(); //for category selection
	const [isNewCategory, setIsNewCategory] = useState(false); //for new category adding status holder

	const [errorForm, setErrorForm] = useState({
		name: "",
		cost: "",
		price: "",
		author: "",
		quantity: "",
		category: "",
	});

	/*
		// fetch all product data from server
	*/
	const fetchData = async () => {
		try {
			const productsList = await axios.get(config.apiPath + "/product/list/", config.headers());
			if (productsList.data.results !== undefined) {
				setProducts(productsList.data.results);
			}

			const authorsList = await axios.get(config.apiPath + "/product/authors/", config.headers());
			if (authorsList.data.results !== undefined) {
				setAuthors(authorsList.data.results);
			}

			const categoriesList = await axios.get(config.apiPath + "/product/categories/", config.headers());
			if (categoriesList.data.results !== undefined) {
				setCategories(categoriesList.data.results);
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

	/*
		// handle save for product add and edit
	*/
	let errorListInFront = [];
	const handleSave = async () => {
		try {
			if (!product.name) errorListInFront.push("name");
			if (selectedAuthor === undefined) errorListInFront.push("author");
			if (selectedCategory === undefined) errorListInFront.push("category");
			if (!product.cost || product.cost < 0) errorListInFront.push("cost");
			if (!product.price || product.price < 0) errorListInFront.push("price");
			if (product.quantity < 0) errorListInFront.push("quantity");
			console.log("errorList: " + errorListInFront);
			if (errorListInFront.length > 0) throw new Error("410");

			if (isNewAuthor) {
				const newAuthor = await axios.post(config.apiPath + "/product/createAuthor/", { name: selectedAuthor }, config.headers());
				product.authorId = parseInt(newAuthor.data.authorId);
			} else {
				product.authorId = parseInt(selectedAuthor);
			}

			if (isNewCategory) {
				const numbers = selectedCategory.filter((item) => typeof item === "number");
				const strings = selectedCategory.filter((item) => typeof item === "string");
				const newCategory = await axios.post(config.apiPath + "/product/createCategory/", { name: strings }, config.headers());
				product.categoriesId = numbers.concat(newCategory.data.categoryId);
			} else {
				product.categoriesId = selectedCategory;
			}

			product.cost = parseInt(product.cost);
			product.price = parseInt(product.price);
			product.quantity = parseInt(product.quantity);
			if (isRemoveIMG) {
				product.img = await handleUpload();
				product.deleteIMG = true;
			} else {
				product.deleteIMG = false;
			}

			let result;
			if (!isEdit) {
				result = await axios.post(config.apiPath + "/product/create/", product, config.headers());
			} else {
				result = await axios.put(config.apiPath + "/product/update/", product, config.headers());
			}

			if (result.data.message === "success") {
				Swal.fire({
					title: "Add product",
					text: isEdit ? "Product saved successfully" : "Product added successfully",
					icon: "success",
					timer: 2000, //2 sec.
				});
				fetchData();
				document.getElementById("modalProduct_btnClose").click();
				setProduct({ ...product, id: undefined }); //clear id
			}
		} catch (e) {
			if (e.message === "410" || e.response.status === 410) {
				const errorList = e.message === "410" ? errorListInFront : e.response.data["errorList"];
				for (let i = 0; i < errorList.length; i++) {
					setErrorBorder(errorList[i]);
				}
				if (errorList.includes("cost")) {
					setProduct((prev) => ({
						...prev,
						cost: NaN,
					}));
				}
				if (errorList.includes("price")) {
					setProduct((prev) => ({
						...prev,
						price: NaN,
					}));
				}
				if (errorList.includes("quantity")) {
					setProduct((prev) => ({
						...prev,
						quantity: NaN,
					}));
				}
			} else {
				Swal.fire({
					title: "Error!",
					text: e.message,
					icon: "error",
					confirmButtonColor: "#dc3545",
				});
			}
		}
	};
	/*
		// handle remove product
	*/
	const handleRemove = async (item) => {
		try {
			const button = await Swal.fire({
				title: "Remove?",
				text: "Do you want to remove " + item.name + "?",
				icon: "question",
				showConfirmButton: true,
				confirmButtonText: "Confirm",
				confirmButtonColor: "#dc3545",
				showCancelButton: true,
			});

			if (button.isConfirmed) {
				const res = await axios.delete(config.apiPath + "/product/remove/" + item.id, config.headers());

				if (res.data.message === "success") {
					Swal.fire({
						title: "Remove product",
						text: "Remove successfully",
						icon: "success",
						timer: 2000,
					});
					fetchData();
				}
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
	/*
		// handle selected file for upload
	*/
	const selectedFile = (inputFile) => {
		if (inputFile !== undefined && inputFile.length > 0) {
			setImg(inputFile[0]);
		}
	};
	/*
		// handle upload image file
	*/
	const handleUpload = async () => {
		try {
			if (!img) return "noIMGFile";
			const formData = new FormData();
			formData.append("img", img);

			const result = await axios.post(config.apiPath + "/product/upload", formData, {
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
			return "noIMGFile";
		}
	};
	/*
		// error handling for form zone
	*/
	const setErrorBorder = (e) => {
		setErrorForm((prev) => ({
			...prev,
			[e]: e,
		}));
	};
	const clearErrorBorder = (e) => {
		setErrorForm((prev) => ({
			...prev,
			[e]: "",
		}));
	};
	const clearErrorForm = () => {
		setErrorForm({
			name: "",
			cost: "",
			price: "",
			author: "",
			quantity: "",
			category: "",
		});
	};
	const clearForm = () => {
		setImg(null);
		if (refImg.current) {
			refImg.current.value = "";
		}
		setSelectedAuthor();
		setIsNewAuthor(false);
		setSelectedCategory();
		setIsNewCategory(false);
		setProduct({
			name: "",
			cost: "",
			price: "",
			desc: "",
			author: "",
			authorId: "",
			quantity: "",
			categoriesName: "",
			deleteIMG: false,
		});
	};

	const onSelectedAuthorChange = (author) => {
		setSelectedAuthor(author[0]);
		typeof author[0] === "string" ? setIsNewAuthor(true) : setIsNewAuthor(false);
	};

	const onSelectedCategoryChange = (category) => {
		setSelectedCategory(category);
		Object.values(category).some((value) => typeof value === "string") ? setIsNewCategory(true) : setIsNewCategory(false);
	};

	return (
		<BackOffice>
			<div className="mb-3">
				<div className="h5" style={{ fontWeight: "bold" }}>
					Product Manager
				</div>
				<button
					onClick={() => {
						setIsEdit(false);
						setIsRemoveIMG(true);
						clearErrorForm();
						clearForm();
					}}
					className="btn btn-primary mr-2 font-weight-bold"
					data-toggle="modal"
					data-target="#modalProduct">
					<i className="fa fa-plus-circle mr-2" aria-hidden="true"></i> Add Product
				</button>
			</div>

			<Table
				id="productTable"
				className={styles.customTable}
				size="small"
				sticky
				bordered={true}
				columns={columns}
				dataSource={products}
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
			/>

			<MyModal id="modalProduct" title={`${isEdit ? "Edit Product" : "Add Product"}`}>
				<div>
					<div>Name</div>
					<Input
						status={errorForm["name"] ? "error" : ""}
						allowClear
						type="text"
						value={product.name}
						onChange={(e) => setProduct({ ...product, name: e.target.value })}
						onKeyDown={() => clearErrorBorder("name")}
					/>
				</div>
				<div className="mt-1">
					<div>Description</div>
					<TextArea rows={3} allowClear placeholder="type some details of the product" value={product.desc} onChange={(e) => setProduct({ ...product, desc: e.target.value })} />
				</div>
				<div className="mt-1">
					<div>Author</div>
					<Select
						key={selectedAuthor}
						className="w-100"
						mode="tags"
						status={errorForm["author"] ? "error" : ""}
						maxCount={1}
						value={selectedAuthor}
						allowClear={true}
						placeholder="Select author"
						showSearch={true}
						optionFilterProp="label"
						options={authors.map((item) => {
							return { label: item.name, value: item.id };
						})}
						onChange={onSelectedAuthorChange}
						onFocus={() => clearErrorBorder("author")}
					/>
				</div>
				<div className="mt-1">
					<div>Category</div>
					<Select
						key={selectedCategory}
						className="w-100"
						mode="tags"
						status={errorForm["category"] ? "error" : ""}
						value={selectedCategory}
						allowClear={true}
						placeholder="Select category"
						showSearch={true}
						optionFilterProp="label"
						options={categories.map((item) => {
							return { label: item.name, value: item.id };
						})}
						onChange={onSelectedCategoryChange}
						onFocus={() => clearErrorBorder("category")}
					/>
				</div>
				<div className="row mt-1">
					<div className="col-md-4">
						<div>Cost</div>
						<Input
							status={errorForm["cost"] ? "error" : ""}
							allowClear
							type="number"
							value={product.cost}
							placeholder="Enter positive integer only"
							min={0}
							onChange={(e) => setProduct({ ...product, cost: e.target.value })}
							onKeyDown={() => clearErrorBorder("cost")}
						/>
					</div>
					<div className="col-md-4">
						<div>Price</div>
						<Input
							status={errorForm["price"] ? "error" : ""}
							allowClear
							type="number"
							value={product.price}
							placeholder="Enter positive integer only"
							min={0}
							onChange={(e) => setProduct({ ...product, price: e.target.value })}
							onKeyDown={() => clearErrorBorder("price")}
						/>
					</div>
					<div className="col-md-4">
						<div>Quantity</div>
						<Input
							status={errorForm["quantity"] ? "error" : ""}
							allowClear
							type="number"
							value={product.quantity}
							placeholder="Enter positive integer only"
							min={0}
							onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
							onKeyDown={() => clearErrorBorder("quantity")}
						/>
					</div>
				</div>

				<div className={`mt-1 ${isRemoveIMG ? "" : "text-center"}`}>
					<div>Cover Image</div>
					{!isEdit || isRemoveIMG ? <input className="mt-1" type="file" ref={refImg} onChange={(e) => selectedFile(e.target.files)} /> : <div ref={refImg} />}

					{isEdit && !isRemoveIMG ? (
						<div class="container containerIMG mt-1" onClick={async () => await setIsRemoveIMG(true)}>
							<Image className="imageProduct" height={200} width="full" src={config.apiPath + "/uploads/product_img/" + product.img} fallback="default_img.webp" preview={false} />
							<div class="middle textIMG">
								<i className="fas fa-trash-alt"></i>
								<div>Click to Remove</div>
							</div>
						</div>
					) : (
						<></>
					)}
				</div>

				<div className="text-right mt-3">
					<button
						className="btn btn-primary font-weight-bold"
						onClick={() => {
							handleSave();
						}}>
						{isEdit ? (
							<>
								<i className="fa fa-save mr-2"></i> Save
							</>
						) : (
							<>
								<i className="fa fa-plus-circle mr-2"></i> Add
							</>
						)}
					</button>
				</div>
			</MyModal>
		</BackOffice>
	);
}

export default Product;
