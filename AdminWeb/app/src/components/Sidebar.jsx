import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";
import { Image } from "antd";

import config from "../config";
import modedLogo from "../MODED_LOGO.png"


function Sidebar() {
	const [user, setUser] = useState({}); // Loged in user info
	const navigate = useNavigate();

	/*
		// Fetch user info
	*/
	const fetchData = async () => {
		try {
			const res = await axios.get(config.apiPath + "/user/info", config.headers());
			if (res.data.result !== undefined) {
				setUser(res.data.result);
			}
		} catch (e) {
			Swal.fire({
				title: "error",
				text: e.message,
				icon: "error",
			});
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	/*
		// Sign out handler
	*/
	const handleSignOut = async () => {
		try {
			const button = await Swal.fire({
				title: "Sign-Out?",
				text: "Please confirm your signing out",
				icon: "question",
				showConfirmButton: true,
				confirmButtonText: "Confirm",
				confirmButtonColor: "#dc3545",
				showCancelButton: true,
			});

			if (button.isConfirmed) {
				localStorage.removeItem("token");
				navigate("/");
			}
		} catch (e) {
			Swal.fire({
				title: "error",
				text: e.message,
				icon: "error",
			});
		}
	};

	return (
		<>
			<aside class="main-sidebar sidebar-dark-primary elevation-4">
				<a href="/home" class="brand-link logo-switch">
					<img src={modedLogo} alt="AdminLTE Logo" class="brand-image-xl img-circle elevation-4 mr-1" style={{ opacity: '.8' }} />
					<span class="brand-text font-weight-bold ml-2">Mod-Ed BackOffice</span>
				</a>

				<div class="sidebar">
					<div class="user-panel mt-3 pb-3 mb-3 d-flex">
						<div class="image">
							<Image
								preview={false}
								width={35}
								height={35}
								src={config.apiPath + "/uploads/user_img/" + user.profile}
								className="img-circle elevation-2"
								fallback="default_profile.jpg"
							/>
						</div>
						<div class="info">
							<l class="d-block" style={{ color: "white" }}>
								{user.name}
							</l>
						</div>
					</div>

					<nav class="mt-0">
						<ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
							<li class="nav-header text-bold">MENU</li>
							<li class="nav-item">
								<Link to="/home" class="nav-link">
									<i class="nav-icon ion ion-pie-graph mr-3" style={{ scale: "1.3" }}></i>
									<p>Dashboard</p>
								</Link>
							</li>
							<li class="nav-item">
								<Link to="/order" class="nav-link">
									<i class="nav-icon fas note-icon-orderedlist mr-3"></i>
									<p>Order Management</p>
								</Link>
							</li>
							<li class="nav-item">
								<Link to="/product" class="nav-link">
									<i class="nav-icon fas fa-box mr-3"></i>
									<p>Product Management</p>
								</Link>
							</li>
							<li class="nav-item">
								<Link to="/user" class="nav-link">
									<i class="nav-icon fas fa-user-alt mr-3"></i>
									<p>User Management</p>
								</Link>
							</li>
						</ul>
					</nav>
				</div>
				<div style={{ position: "absolute", bottom: "0px", width: "100%", padding: "10px" }}>
					<button
						onClick={handleSignOut}
						className="btn btn-danger btn-block"
						style={{
							marginTop: "10px",
							whiteSpace: "nowrap",
							height: "40px",
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<i className="fa fa-power-off fa-lg"></i>
					</button>
				</div>
			</aside>
		</>
	);
}

export default Sidebar;
