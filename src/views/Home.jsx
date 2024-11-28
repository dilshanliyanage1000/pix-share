import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const navigate = useNavigate();

    if (!userData) {
        navigate("/");
    }

    return (
        <>
            <Navbar />

            <h5>Dashboard</h5>
        </>
    );

};

export default Home;