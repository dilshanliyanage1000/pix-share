import React, { useState } from 'react';
import "../assets/css/App.css";
import Logo from "../assets/img/Logo.png";

const LoginRegistration = () => {

    const [EmailAddress, setEmailAddress] = useState("");
    const [UserPassword, setUserPassword] = useState("");

    const [FullName, setFullName] = useState("");
    const [RegEmailAddress, setRegEmailAddress] = useState("");
    const [Username, setUsername] = useState("");
    const [RegUserPassword, setRegUserPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5124/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ EmailAddress: EmailAddress, UserPassword: UserPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful!", data);
            } else {
                console.error("Login failed:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during login:", error);
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5124/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ FullName: FullName, Username: Username, EmailAddress: RegEmailAddress, UserPassword: RegUserPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login successful!", data);
            } else {
                console.error("Login failed:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during login:", error);
        }
    };

    return (

        <div className='custom_img'>

            <div className="container d-flex justify-content-center align-items-center vh-100">

                <div className="login-container shadow-sm bg-white">

                    <div className="text-center">
                        <img src={Logo} alt={Logo} style={{ width: "50%", marginTop: "2rem", marginBottom: "1rem" }} />
                        <p className='fs-5' style={{ color: "#a21fd1", marginBottom: "5rem", fontFamily: 'QueensidesMedium' }}>SHARE & EXPLORE WITH NO DISTRACTIONS!</p>
                    </div>

                    <div className="row">

                        <div className="col-md-5">

                            <div className="text-center mb-3">
                                <p className='text-muted '>Already have an account?</p>
                            </div>

                            <form onSubmit={handleLogin}>

                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email address"
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        value={EmailAddress}
                                        onChange={(e) => setEmailAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={UserPassword}
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        onChange={(e) => setUserPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div id='login_error' className="text-center mb-3">
                                    <p style={{ color: "b83a39", display: "none" }}>Incorrect username or password!</p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}
                                >
                                    Log In
                                </button>
                            </form>
                        </div>

                        <div className="col-md-1 d-flex justify-content-center align-items-center">
                            <div
                                style={{
                                    borderLeft: "2px solid #dbdbdb",
                                    height: "100%",
                                }}
                            ></div>
                        </div>

                        <div className="col-md-6">

                            <div className="text-center mb-3">
                                <p className='text-muted '>New to PixShare?</p>
                            </div>

                            <form onSubmit={handleRegistration}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full Name"
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        value={FullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email address"
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        value={RegEmailAddress}
                                        onChange={(e) => setRegEmailAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Username"
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        value={Username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        style={{ backgroundColor: "#fafafa", border: "1px solid #dbdbdb" }}
                                        value={RegUserPassword}
                                        onChange={(e) => setRegUserPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="text-center mb-3">
                                    <p id='reg_error' style={{ color: "b83a39", display: "none" }}></p>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}
                                >
                                    Sign Up
                                </button>

                            </form>

                        </div>

                    </div>

                    <hr className='mt-5' />

                    <p className="text-center text-muted">
                        Copyright © 2024 PixShare - Dilshan & Ritika. All Rights Reserved.
                    </p>

                </div>

            </div>

        </div>

    );

}

export default LoginRegistration;