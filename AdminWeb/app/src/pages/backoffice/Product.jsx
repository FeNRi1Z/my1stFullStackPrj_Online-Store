import { useEffect, useState, useRef } from 'react';
import BackOffice from '../../components/BackOffice';
import MyModal from '../../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

import { Select, Input } from 'antd';
const { TextArea } = Input;

axios.interceptors.response.use(
    response => response,  // Return the response normally if successful
    error => {
        if (error.response && error.response.status === 401) {
            // Automatically redirect to sign in page if 401 Unauthorized is returned
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

function showImage(item) {
    if (item.img !== undefined) {
        let imgPath = config.apiPath + '/uploads/product_img/' + item.img;

        if (item.img === "noIMGFile") imgPath = 'default_img.webp';

        return <img alt='' className='img-fluid' src={imgPath} />
    }
    return <></>;
}

function Product() {
    const [product, setProduct] = useState({}); //for new product adding holder
    const [products, setProducts] = useState([]); //fetched product data

    const [authors, setAuthors] = useState([]); //fetched author data
    const [selectedAuthor, setSelectedAuthor] = useState(); //for author selection
    const [isNewAuthor, setIsNewAuthor] = useState(false); //for new author adding status holder

    const [categories, setCategories] = useState([]); //fetched category data
    const [selectedCategory, setSelectedCategory] = useState([]); //for category selection
    const [isNewCategory, setIsNewCategory] = useState(false); //for new category adding status holder

    const [errorForm, setErrorForm] = useState({
        name: '',
        cost: '',
        price: '',
        author: '',
        quantity: '',
    });
    const [img, setImg] = useState({}); //file upload
    const refImg = useRef();
    const [fileExcel, setFileExcel] = useState({}); //excel upload
    const refExcel = useRef();

    const [isEdit, setIsEdit] = useState(false); //for Product modal text display

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const productsList = await axios.get(config.apiPath + '/product/list/', config.headers());
            if (productsList.data.results !== undefined) {
                setProducts(productsList.data.results);
            }

            const authorsList = await axios.get(config.apiPath + '/product/authors/', config.headers());
            if (authorsList.data.results !== undefined) {
                setAuthors(authorsList.data.results);
            }

            const categoriesList = await axios.get(config.apiPath + '/product/categories/', config.headers());
            if (categoriesList.data.results !== undefined) {
                setCategories(categoriesList.data.results);
            }

        } catch (e) {
            Swal.fire({
                title: 'Error!',
                text: e.message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    }

    let errorListInFront = [];
    const handleSave = async () => {
        try {
            if (!product.name) errorListInFront.push('name');
            if (!product.cost || product.cost < 0) errorListInFront.push('cost');
            if (!product.price || product.price < 0) errorListInFront.push('price');
            if (!product.quantity || product.quantity < 0) errorListInFront.push('quantity');
            if (selectedAuthor === undefined) errorListInFront.push('author');
            console.log("errorList: " + errorListInFront);
            if (errorListInFront.length > 0) throw new Error("410");

            if (isNewAuthor) {
                const newAuthor = await axios.post(config.apiPath + '/product/createAuthor/', { name: selectedAuthor }, config.headers());
                product.authorId = parseInt(newAuthor.data.authorId);
            } else {
                product.authorId = parseInt(selectedAuthor);
            }

            product.cost = parseInt(product.cost);
            product.price = parseInt(product.price);
            product.quantity = parseInt(product.quantity);
            product.img = await handleUpload();

            let result;
            if (!isEdit) {
                result = await axios.post(config.apiPath + '/product/create/', product, config.headers());
            } else {
                result = await axios.put(config.apiPath + '/product/update/', product, config.headers());
            }

            if (result.data.message === 'success') {
                Swal.fire({
                    title: 'Add product',
                    text: isEdit ? 'Product saved successfully' : 'Product added successfully',
                    icon: 'success',
                    timer: 2000 //2 sec.
                });
                fetchData();
                document.getElementById('modalProduct_btnClose').click();
                setProduct({ ...product, id: undefined }); //clear id
            }

        } catch (e) {
            if (e.message === "410" || e.response.status === 410) {
                const errorList = e.message === "410" ? errorListInFront : e.response.data['errorList'];
                for (let i = 0; i < errorList.length; i++) {
                    setErrorBorder(errorList[i]);
                }
                if (errorList.includes('cost')) {
                    setProduct((prev) => ({
                        ...prev, cost: NaN
                    }));
                }
                if (errorList.includes('price')) {
                    setProduct((prev) => ({
                        ...prev, price: NaN
                    }));
                }
                if (errorList.includes('quantity')) {
                    setProduct((prev) => ({
                        ...prev, quantity: NaN
                    }));
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: e.message,
                    icon: 'error',
                    confirmButtonColor: '#dc3545'
                });
            }
        }
    }

    const handleRemove = async (item) => {
        try {
            const button = await Swal.fire({
                title: 'Remove?',
                text: 'Do you want to remove ' + item.name + '?',
                icon: 'question',
                showConfirmButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#dc3545",
                showCancelButton: true
            });

            if (button.isConfirmed) {
                const res = await axios.delete(config.apiPath + '/product/remove/' + item.id, config.headers());

                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Remove product',
                        text: 'Remove successfully',
                        icon: 'success',
                        timer: 2000
                    });
                    fetchData();
                }
            }
        } catch (e) {
            Swal.fire({
                title: 'Error!',
                text: e.message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            });
        }
    }

    const selectedFile = (inputFile) => {
        if (inputFile !== undefined && inputFile.length > 0) {
            setImg(inputFile[0]);
        }
    }

    const handleUpload = async () => {
        try {
            if (!img) return "noIMGFile";
            const formData = new FormData();
            formData.append('img', img);

            const result = await axios.post(config.apiPath + '/product/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            })

            if (result.data.newName !== undefined) {
                return result.data.newName;
            }
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            })
            return "noIMGFile";
        }
    }

    const selectedFileExcel = (fileInput) => {
        if (fileInput !== undefined && fileInput.length > 0) {
            setFileExcel(fileInput[0]);
        }
    }

    const handleUploadExcel = async () => {
        try {
            const formData = new FormData();
            formData.append('fileExcel', fileExcel);

            const result = await axios.post(config.apiPath + '/product/uploadFromExcel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': localStorage.getItem('token')
                }
            });

            if (result.data.message === 'success') {
                Swal.fire({
                    title: 'Import products from sheet',
                    text: 'Import successfully',
                    icon: 'success',
                    timer: 2000
                });
                fetchData();
                document.getElementById('modalSheet_btnClose').click();
            }
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error',
                confirmButtonColor: '#dc3545'
            })
        }
    }

    const clearFormExcel = () => {
        setFileExcel(null);
        refExcel.current.value = '';
    }

    const setErrorBorder = (e) => {
        setErrorForm((prev) => ({
            ...prev, [e]: e
        }));
    }

    const clearErrorBorder = (e) => {
        setErrorForm((prev) => ({
            ...prev, [e]: ''
        }));
    }

    const clearErrorForm = () => {
        setErrorForm({
            name: '',
            cost: '',
            price: '',
            author: '',
            quantity: '',
            category: ''
        });
    }

    const clearForm = () => {
        setImg(null);
        refImg.current.value = '';
        setSelectedAuthor();
        setIsNewAuthor(false);
        setSelectedCategory([]);
        setIsNewCategory(false);
        setProduct({
            name: '',
            cost: '',
            price: '',
            desc: '',
            author: '',
            authorId: '',
            quantity: ''
        })
    }

    const onSelectedAuthorChange = (author) => {
        setSelectedAuthor(author[0]);
        typeof (author[0]) === 'string' ? setIsNewAuthor(true) : setIsNewAuthor(false);
    }

    const onSelectedCategoryChange = (category) => {
        setSelectedCategory((prev) => {
            if (!prev.includes(category[0])) {
                return [...prev, category[0]];
            }
        });
        typeof (category[0]) === 'string' ? setIsNewCategory(true) : setIsNewCategory(false);
    }

    return <BackOffice>
        <div className='h5' style={{ fontWeight: 'bold' }}>Product</div>
        <button onClick={() => { clearForm(); clearErrorForm(); setIsEdit(false) }} className='btn btn-primary mr-2 font-weight-bold' data-toggle='modal' data-target='#modalProduct'>
            <i className='fa fa-plus-circle mr-2' aria-hidden="true"></i> Add Product
        </button>
        <button onClick={clearFormExcel} className='btn btn-outline-success' data-toggle='modal' data-target='#modalSheet'>
            <i className='fa fa-arrow-down mr-2'></i>Import products from sheet
        </button>
        <table className='mt-3 table table-responsive-sm table-bordered table-striped table-hover table-head-fixed'>
            <thead className='table-light'>
                <tr>
                    <th width='150px'>Cover</th>
                    <th>Name</th>
                    <th width='150px'>Description</th>
                    <th>Author</th>
                    <th>Categories</th>
                    <th width='75px' className='text-right'>Cost</th>
                    <th width='75px' className='text-right'>Price</th>
                    <th width='80px' className='text-right'>Quantity</th>
                    <th width='120px' className='text-center'>Modify</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(item =>
                    <tr key={item.id}>
                        <td>{showImage(item)}</td>
                        <td><div className='text-truncate' style={{ maxWidth: '150px' }}>{item.name}</div></td>
                        <td><div className='text-truncate' style={{ maxWidth: '150px' }}>{item.desc}</div></td>
                        <td><div className='text-truncate' style={{ maxWidth: '150px' }}>{item.author}</div></td>
                        <td>{"spare category"}</td>
                        <td className='text-right'>{item.cost}</td>
                        <td className='text-right'>{item.price}</td>
                        <td className='text-right'>{item.quantity}</td>
                        <td className='text-center'>
                            <button className='btn btn-primary mr-2' style={{ width: '40px', height: '40px' }} data-toggle='modal' data-target='#modalProduct' onClick={() => { clearForm(); clearErrorForm(); setIsEdit(true); setProduct(item); setSelectedAuthor(item.authorId) }}>
                                <i className='ion-edit' style={{ fontSize: '15px' }}></i> {/*Edit button*/}
                            </button>
                            <button className='btn btn-danger' style={{ width: '40px', height: '40px' }} onClick={() => handleRemove(item)}>
                                <i className='ion-android-delete' style={{ fontSize: '18px' }}></i> {/*Delete button*/}
                            </button>
                        </td>
                    </tr>
                ) : <></>}
            </tbody>
        </table>

        <MyModal id='modalProduct' title={`${isEdit ? 'Edit Product' : 'Add Product'}`}>
            <div>
                <div>Name</div>
                <Input status={errorForm['name'] ? 'error' : ''} allowClear type='text' value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} onKeyDown={() => clearErrorBorder('name')} />
            </div>
            <div className='mt-1'>
                <div>Description</div>
                <TextArea rows={3} allowClear placeholder="type some details of the product" value={product.desc} onChange={e => setProduct({ ...product, desc: e.target.value })} />
            </div>
            <div className='mt-1'>
                {/* <button className='btn btn-primary size-5' onClick={() => console.log(selectedAuthor, typeof (selectedAuthor), isNewAuthor)}></button> */}
                <div>Author</div>
                <Select
                    key={selectedAuthor}
                    className='w-100'
                    mode='tags'
                    status={errorForm['author'] ? 'error' : ''}
                    maxCount={1}
                    value={selectedAuthor}
                    allowClear={true}
                    placeholder="Select author"
                    showSearch={true}
                    optionFilterProp="label"
                    options={authors.map(item => { return { label: item.name, value: item.id } })}
                    onChange={onSelectedAuthorChange}
                    onFocus={() => clearErrorBorder('author')}
                />
            </div>
            <div className='mt-1'>
                <button className='btn btn-primary size-5' onClick={() => console.log(selectedCategory, typeof (selectedCategory), isNewCategory)}></button>
                <div>Category</div>
                {/* <Select
                    key={selectedCategory}
                    className='w-100'
                    mode='tags'
                    status={errorForm['category'] ? 'error' : ''}
                    value={selectedCategory}
                    allowClear={true}
                    placeholder="Select categories"
                    showSearch={true}
                    optionFilterProp="label"
                    options={categories.map(item => { return { label: item.name, value: item.id } })}
                    onChange={onSelectedCategoryChange}
                    onFocus={() => clearErrorBorder('category')}
                /> */}
            </div>
            <div className='row mt-1'>
                <div className='col-md-4'>
                    <div>Cost</div>
                    <Input
                        status={errorForm['cost'] ? 'error' : ''}
                        allowClear
                        type='number'
                        value={product.cost}
                        placeholder="Enter positive integer only"
                        min={0}
                        onChange={e => setProduct({ ...product, cost: e.target.value })}
                        onKeyDown={() => clearErrorBorder('cost')}
                    />
                </div>
                <div className='col-md-4'>
                    <div>Price</div>
                    <Input
                        status={errorForm['price'] ? 'error' : ''}
                        allowClear
                        type='number'
                        value={product.price}
                        placeholder="Enter positive integer only"
                        min={0}
                        onChange={e => setProduct({ ...product, price: e.target.value })}
                        onKeyDown={() => clearErrorBorder('price')}
                    />
                </div>
                <div className='col-md-4'>
                    <div>Quantity</div>
                    <Input
                        status={errorForm['quantity'] ? 'error' : ''}
                        allowClear
                        type='number'
                        value={product.quantity}
                        placeholder="Enter positive integer only"
                        min={0}
                        onChange={e => setProduct({ ...product, quantity: e.target.value })}
                        onKeyDown={() => clearErrorBorder('quantity')}
                    />
                </div>
            </div>

            <div className='mt-1'>
                <div>Cover image</div>
                <input type='file' ref={refImg} onChange={e => selectedFile(e.target.files)} />
                <div className='mt-2'>{showImage(product)}</div>
            </div>
            <div className='mt-3'>
                <button className='btn btn-primary font-weight-bold' onClick={handleSave}>
                    {isEdit ? <><i className='fa fa-save mr-2'></i> Save</> : <><i className='fa fa-plus-circle mr-2'></i> Add</>}
                </button>
            </div>
        </MyModal>

        <MyModal id='modalSheet' title='Import products from sheet'>
            <div>Please select the product sheet file</div>
            <div className='mt-1'><input type='file' ref={refExcel} onChange={e => selectedFileExcel(e.target.files)} /></div>
            <button className='mt-3 btn btn-primary' onClick={handleUploadExcel}>
                <i className='fa fa-arrow-down mr-2'></i> Import
            </button>
        </MyModal>

    </BackOffice>
}

export default Product;