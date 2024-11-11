import { useEffect, useState, useRef } from 'react';
import BackOffice from '../../components/BackOffice';
import MyModal from '../../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

import Select from '@oshq/react-select';
import '@oshq/react-select/index.css';

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

    const [isNewAuthor, setIsNewAuthor] = useState(false); //for new author adding status holder
    const [authors, setAuthors] = useState([]); //fetched author data

    const [selectedAuthor, setSelectedAuthor] = useState(1);
    const options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
        { label: "Option 3", value: "option3" },
        { label: "Option 4", value: "option4" },
        { label: "Option 5", value: "option5" },
        // Add more options here
    ];

    const [errorForm, setErrorForm] = useState({
        name: '',
        cost: '',
        price: '',
        author: ''
    });
    const [img, setImg] = useState({}); //file upload
    const [fileExcel, setFileExcel] = useState({}); //excel upload
    const refImg = useRef();
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

        } catch (e) {
            Swal.fire({
                title: 'Error!',
                text: e.message,
                icon: 'error'
            });
        }
    }

    let errorListInFront = [];
    const handleSave = async () => {
        try {
            if (!product.name) errorListInFront.push('name');
            if (!product.cost || product.cost < 0) errorListInFront.push('cost');
            if (!product.price || product.price < 0) errorListInFront.push('price');
            if (!selectedAuthor) errorListInFront.push('author');

            if (errorListInFront.length > 0) throw new Error("410");

            if (isNewAuthor) {
                const newAuthor = await axios.post(config.apiPath + '/product/createAuthor/', { name: selectedAuthor }, config.headers());
                product.authorId = parseInt(newAuthor.data.authorId);
            } else {
                product.authorId = parseInt(selectedAuthor);
            }
            product.cost = parseInt(product.cost);
            product.price = parseInt(product.price);
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
                    text: product.id ? 'Product saved successfully' : 'Product added successfully',
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
                        ...prev, 'cost': NaN
                    }));
                }
                if (errorList.includes('price')) {
                    setProduct((prev) => ({
                        ...prev, 'price': NaN
                    }));
                }
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: e.message,
                    icon: 'error'
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
                icon: 'error'
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
                icon: 'error'
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
                icon: 'error'
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
            author: ''
        });
    }

    const clearForm = () => {
        setImg(null);
        refImg.current.value = '';
        setSelectedAuthor(1);
        setIsNewAuthor(false);
        setProduct({
            name: '',
            cost: '',
            price: '',
            desc: '',
            author: '',
            authorId: ''
        })
    }

    return <BackOffice>
        <div className='h5' style={{ fontWeight: 'bold' }}>Product</div>
        <button onClick={() => { clearForm(); clearErrorForm(); setIsEdit(false) }} className='btn btn-primary mr-2 font-weight-bold' data-toggle='modal' data-target='#modalProduct'>
            <i className='fa fa-plus-circle mr-2' aria-hidden="true"></i> Add Product
        </button>
        <button onClick={clearFormExcel} className='btn btn-outline-success' data-toggle='modal' data-target='#modalSheet'>
            <i className='fa fa-arrow-down mr-2'></i>Import products from sheet
        </button>
        <table className='mt-3 table table-bordered table-striped table-hover table-head-fixed'>
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
                <input className={`form-control ${errorForm['name'] ? 'border border-danger rounded' : ''}`} type='text' value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} onKeyDown={() => clearErrorBorder('name')} />
            </div>
            <div className='mt-1'>
                <div>Description</div>
                <textarea id="message" rows="3" className="form-control" placeholder="type some details of the product" value={product.desc} onChange={e => setProduct({ ...product, desc: e.target.value })} />
            </div>
            <div className='mt-1'>
                <div>Author</div>
                <Select
                    value={selectedAuthor}
                    searchable={true}
                    creatable={true}
                    showclear={true}
                    createLabel='Add new author'
                    placeholder="Select author"
                    options={async () => authors.map(item => { return { label: item.name, value: item.id } })}
                    onChange={(_, val) => {
                        if (!val || typeof (val) === 'object') val = 1;
                        typeof (val) === 'string' ? setIsNewAuthor(true) : setIsNewAuthor(false);
                        setSelectedAuthor(val);
                    }}
                    className={"form-control"}
                />
            </div>
            <div className='mt-1'>
                <div>Category</div>
                {/* <Select
                    value={selected}
                    multiple={true}
                    searchable={true}
                    creatable={true}
                    showclear={true}
                    createLabel='Add new category'
                    placeholder="Select category"
                    onChange={(_, val) => {
                        setSelected(val);
                    }}
                    options={async () => options}
                /> */}
            </div>
            <div className='mt-1'>
                <div>Cost</div>
                <input className={`form-control ${errorForm['cost'] ? 'border border-danger rounded' : ''}`} type='number' value={product.cost} placeholder="Enter positive integer only" min={0} onChange={e => setProduct({ ...product, cost: e.target.value })} onKeyDown={() => clearErrorBorder('cost')} />
            </div>
            <div className='mt-1'>
                <div>Price</div>
                <input className={`form-control ${errorForm['price'] ? 'border border-danger rounded' : ''}`} type='number' value={product.price} placeholder="Enter positive integer only" min={0} onChange={e => setProduct({ ...product, price: e.target.value })} onKeyDown={() => clearErrorBorder('price')} />
            </div>
            <div className='mt-1'>
                <div>Quantity</div>
                {/* <input className={`form-control ${errorForm['price'] ? 'border border-danger rounded' : ''}`} type='number' value={product.price} placeholder="Enter positive integer only" min={0} onChange={e => setProduct({ ...product, price: e.target.value })} onKeyDown={() => clearErrorBorder('price')} /> */}
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