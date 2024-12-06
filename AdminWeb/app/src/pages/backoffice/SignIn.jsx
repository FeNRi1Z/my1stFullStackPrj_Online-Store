import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import Swal from "sweetalert2";

import config from "../../config";

axios.interceptors.response.use(
	(response) => response, // Return the response normally if successful
	(error) => {
		if (error.response && error.response.status === 401) {
			// Automatically redirect if 401 Unauthorized is returned
			window.location.href = "/";
		}
		return Promise.reject(error);
	}
);

function SignIn() {
	const [user, setUser] = useState({}); // user = {user: "", pass: ""}
	const [validUsername, setValidUsername] = useState(""); // validUsername = "inValid" for handleSignIn
	const [validPassword, setValidPassword] = useState(""); // validPassword = "inValid" for handleSignIn
	const navigate = useNavigate();

    /*
    Sign in function
    */
	const handleSignIn = async () => {
		try {
			const result = await axios.post(config.apiPath + "/user/signIn", user);
			if (result.data.token !== undefined) {
				localStorage.setItem("token", result.data.token);
				navigate("/home");
			}
		} catch (e) {
			if (e.response.status === 410) {
				Swal.fire({
					title: "Sign-in failed",
					text: "Invalid! Username or Password",
					icon: "warning",
				});
			} else if (e.response.status === 411) {
				//Require username
				const usernameForm = document.getElementById("usernameForm");
				usernameForm.style.border = "1px solid red";
				usernameForm.style.borderRadius = "0.25rem";
				setValidUsername("inValid");
			} else if (e.response.status === 412) {
				//Require password
				const passwordForm = document.getElementById("passwordForm");
				passwordForm.style.border = "1px solid red";
				passwordForm.style.borderRadius = "0.25rem";
				setValidPassword("inValid");
			} else {
				Swal.fire({
					title: "Error",
					text: e.message,
					icon: "error",
				});
			}
		}
	};
	/*
    Clear red border and alert message
    */
	function clearRedBorder(id) {
		const border = document.getElementById(id);
		border.style.border = "none";
		id === "usernameForm" ? setValidUsername("") : setValidPassword("");
	}

	return (
		<div class="hold-transition login-page">
			<div class="login-box">
				<div class="login-logo">
					<l>
						<b>Mod-Ed_</b>Admin_Panel
					</l>
				</div>
				<div class="card">
					<div class="card-body login-card-body">
						<p class="login-box-msg" style={{ height: "25px" }}>
							Sign in to start your sessions
						</p>
						<div>
							<div style={{ height: "22px" }}>
								{validUsername && (
									<l id="usernameAlert" className="text-danger" style={{ fontSize: "12px" }}>
										Username is required!
									</l>
								)}
							</div>
							<div id="usernameForm" class="input-group mb-0" style={{}}>
								<input
									type="username"
									class="form-control"
									placeholder="Username"
									required
									onChange={(e) => setUser({ ...user, user: e.target.value })}
									onKeyDown={() => clearRedBorder("usernameForm")}
									onKeyUp={(e) => (e.key === "Enter" ? handleSignIn() : null)}
								/>
								<div class="input-group-append">
									<div class="input-group-text">
										<span class="fas fa-envelope"></span>
									</div>
								</div>
							</div>
							<div style={{ height: "22px" }}>
								{validPassword && (
									<l id="passwordAlert" className="text-danger" style={{ fontSize: "12px" }}>
										Password is required!
									</l>
								)}
							</div>
							<div id="passwordForm" class="input-group mb-3">
								<input
									type="password"
									class="form-control"
									placeholder="Password"
									required
									onChange={(e) => setUser({ ...user, pass: e.target.value })}
									onKeyDown={() => clearRedBorder("passwordForm")}
									onKeyUp={(e) => (e.key === "Enter" ? handleSignIn() : null)}
								/>
								<div class="input-group-append">
									<div class="input-group-text">
										<span class="fas fa-lock"></span>
									</div>
								</div>
							</div>
							<div class="align-content-center">
								<div class="container">
									<button type="submit" class="btn btn-primary btn-block" onClick={handleSignIn}>
										Sign In
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
