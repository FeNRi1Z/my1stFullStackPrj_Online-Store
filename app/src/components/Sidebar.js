import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";


function Sidebar() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(config.apiPath + '/user/info', config.headers());
            console.log(res);
            if (res.data.result !== undefined) {
                setUser(res.data.result);
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleSignOut = async () => {
        try {
            const button = await Swal.fire({
                title: 'Sign-Out?',
                text: 'Please confirm your signing out',
                icon: 'question',
                showConfirmButton: true,
                confirmButtonText: "Confirm",
                confirmButtonColor: "#dc3545",
                showCancelButton: true
            })

            if (button.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/');
            }
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    return <>
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <a href="index3.html" class="brand-link">
                <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                <span class="brand-text font-weight-light">AdminLTE 3</span>
            </a>

            <div class="sidebar">
                <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div class="image">
                        <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User" />
                    </div>
                    <div class="info">
                        <l class="d-block" style={{color: "white"}}>{user.name}</l>
                    </div>
                </div>

                <nav class="mt-0">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <li class="nav-header">MENU</li>
                        <li class="nav-item">
                            <Link to="/product" class="nav-link">
                                <i class="nav-icon fas fa-box"></i>
                                <p>
                                    Product
                                    <span class="badge badge-info right">2</span>
                                </p>
                            </Link>
                        </li>
                        <li class="nav-item">
                            <a href="pages/gallery.html" class="nav-link">
                                <i class="nav-icon fas fa-image"></i>
                                <p>
                                    Spare
                                </p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="pages/kanban.html" class="nav-link">
                                <i class="nav-icon fas fa-columns"></i>
                                <p>
                                    Spare
                                </p>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div style={{ position: 'absolute', bottom: '0px', width: '100%', padding: '10px' }}>
                <button onClick={handleSignOut}
                    className="btn btn-danger btn-block"
                    style={{
                        marginTop: '10px',
                        whiteSpace: 'nowrap',
                        height: '40px', width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} >
                    <i className="fa fa-power-off fa-lg"></i>
                    {/* <span>Sign Out</span> */}
                </button>
            </div>
        </aside>
    </>
}

export default Sidebar;