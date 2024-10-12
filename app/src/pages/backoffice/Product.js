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
        name:'',
        cost:'',
        price:''
    });
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/product/list', config.headers());

            if (res.data.results !== undefined) {
                setProducts(res.data.results);
            }
        } catch (e) {
            Swal.fire({
                title: 'Error',
                text: e.message,
                icon: 'error'
            });
        }
    }

    const handleSave = async () => {
        try {
            product.cost = parseInt(product.cost);
            product.price = parseInt(product.price);
            
            const result = await axios.post(config.apiPath + '/product/create', product, config.headers());

            if (result.data.message === 'success') {
                Swal.fire({
                    title: 'Sucess',
                    text: 'Procuct Added Sucessfully',
                    icon: 'success',
                    timer: 2000 //2 sec.
                });
                document.getElementById('modalProduct_btnClose').click();
                fetchData();
            }
        } catch (e) {
            if (e.response.status === 410) {
                const errorList = e.response.data['data'];
                for(let i=0; i<errorList.length; i++) {
                    setErrorBorder(errorList[i]);
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: e.message,
                    icon: 'error'
                });
            }
        }
    }

    const setErrorBorder = (e) => {
        setErrorForm((prev) => ({
            ...prev, [e]:e
        }));
    }

    const clearErrorBorder = (e) => {
        setErrorForm((prev) => ({
            ...prev, [e]:''
        }));
    }

    const clearForm = () => {
        setProduct({
            name:"", 
            cost:"", 
            price:"",
            img:""
        })
    } 

    return <BackOffice>
        <div className='h5' style={{fontWeight:'bold'}}>Product</div>
        <button onClick={clearForm} className='btn btn-primary' data-toggle='modal' data-target='#modalProduct'>
            <i className='fa fa-plus-circle mr-2' aria-hidden="true"></i> Add
        </button>

        <MyModal id='modalProduct' title='Add Product'>
            <div>
                <div>Name</div>
                <input className={`form-control ${errorForm['name']? 'border border-danger rounded' : ''}`} value={product.name} onChange={e => setProduct({...product, name:e.target.value})} onKeyDown={() => clearErrorBorder('name')}/>
            </div>
            <div className='mt-1'>
                <div>Cost</div>
                <input className={`form-control ${errorForm['cost']? 'border border-danger rounded' : ''}`} type='number' value={product.cost} placeholder="Enter positive integer only" min={0} onChange={e => setProduct({...product, cost:e.target.value})} onKeyDown={() => clearErrorBorder('cost')}/>
            </div>
            <div className='mt-1'>
                <div>Price</div>
                <input className={`form-control ${errorForm['price']? 'border border-danger rounded' : ''}`} type='number' value={product.price} placeholder="Enter positive integer only" min={0} onChange={e => setProduct({...product, price:e.target.value})} onKeyDown={() => clearErrorBorder('price')}/>
            </div>
            <div className='mt-1'>
                <div>Image</div>
                <input type='file' value={product.img}/>
            </div>
            <div className='mt-3'>
                <button className='btn btn-primary' onClick={handleSave}>
                    <i className='fa fa-check mr-2'></i>Add
                </button>
            </div>
        </MyModal>
    </BackOffice>
}

export default Product;