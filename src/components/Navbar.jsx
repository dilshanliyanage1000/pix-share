import React from 'react';
import { Link } from "react-router-dom";
import MainLogo from '../assets/img/logo.png';

const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (

        <nav className="navbar navbar-expand-lg bg-body-tertiary">

            <div className="container-fluid">

                <Link className="navbar-brand mx-auto" to="/">
                    <img src={MainLogo} alt={MainLogo} width="45" />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" onClick={handleLogout} href="#">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );

};

export default Navbar;