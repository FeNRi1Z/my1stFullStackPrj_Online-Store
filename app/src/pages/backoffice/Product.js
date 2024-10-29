import { useEffect, useState } from 'react';
import BackOffice from '../../components/BackOffice';
import MyModal from '../../components/MyModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../../config';

axios.interceptors.response.use(
    response => response,  // Return the response normally if successful
    error => {
        if (error.response && error.response.status === 401) {
            // Automatically redirect if 401 Unauthorized is returned
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

function Product() {
    const [product, setProduct] = useState({});
    const [errorForm, setErrorForm] = useState({
        name: '',
        cost: '',
        price: ''
    });
    const [products, setProducts] = useState([]); //fetched data

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list/', config.headers());

            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'Error!',
                text: e.message,
                icon: 'error'
            });
        }
    }

    const handleSave = async () => {
        try {
            product.cost = parseInt(product.cost);
            product.price = parseInt(product.price);

            let result;
            if (product.id === undefined) {
                result = await axios.post(config.apiPath + '/product/create/', product, config.headers());
            } else {
                result = await axios.put(config.apiPath + '/product/update/', product, config.headers());
            }

            if (result.data.message === 'success') {
                Swal.fire({
                    title: 'Success',
                    text: product.id ? 'Procuct Saved Successfully' : 'Procuct Added Successfully',
                    icon: 'success',
                    timer: 2000 //2 sec.
                });
                document.getElementById('modalProduct_btnClose').click();
                fetchData();

                setProduct({ ...product, id: undefined }); //clear id
            }
        } catch (e) {
            if (e.response.status === 410) {
                const errorList = e.response.data['errorList'];
                for (let i = 0; i < errorList.length; i++) {
                    setErrorBorder(errorList[i]);
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
                        title: 'Remove',
                        text: 'Remove success',
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
            price: ''
        });
    }

    const clearForm = () => {
        setProduct({
            name: "",
            cost: "",
            price: "",
            img: ""
        })
    }

    return <BackOffice>
        <div className='h5' style={{ fontWeight: 'bold' }}>Product</div>
        <button onClick={() => { clearForm(); clearErrorForm() }} className='btn btn-primary font-weight-bold' data-toggle='modal' data-target='#modalProduct'>
            <i className='fa fa-plus-circle mr-2' aria-hidden="true"></i> Add
        </button>

        <table className='mt-3 table table-bordered table-striped'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th width='150px' className='text-right'>Cost</th>
                    <th width='150px' className='text-right'>Price</th>
                    <th width='120px' className='text-center'>Modify</th>
                </tr>
            </thead>
            <tbody>
                {products.length > 0 ? products.map(item =>
                    <tr>
                        <td>{item.name}</td>
                        <td className='text-right'>{item.cost}</td>
                        <td className='text-right'>{item.price}</td>
                        <td className='text-center'>
                            <button className='btn btn-primary mr-2' style={{ width: '40px', height: '40px' }} data-toggle='modal' data-target='#modalProduct' onClick={e => setProduct(item)}>
                                <i className='ion-edit' style={{ fontSize: '15px' }}></i>
                            </button>
                            <button className='btn btn-danger' style={{ width: '40px', height: '40px' }} onClick={e => handleRemove(item)}>
                                <i className='ion-android-delete' style={{ fontSize: '18px' }}></i>
                            </button>
                        </td>
                    </tr>
                ) : <> </>}
            </tbody>
        </table>

        <MyModal id='modalProduct' title={`${product.name ? 'Edit Product' : 'Add Product'}`}>
            <div>
                <div>Name</div>
                <input className={`form-control ${errorForm['name'] ? 'border border-danger rounded' : ''}`} value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} onKeyDown={() => clearErrorBorder('name')} />
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
                <div>Image</div>
                <input type='file' value={product.img} />
            </div>
            <div className='mt-3'>
                <button className='btn btn-primary font-weight-bold' onClick={handleSave}>
                    {product.name ? <><i className='fa fa-save mr-2'></i> Save</> : <><i className='fa fa-plus-circle mr-2'></i> Add</>}
                </button>
            </div>
        </MyModal>
    </BackOffice>
}

export default Product;