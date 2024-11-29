import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/Home.css'

const CreatePost = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));

    const [postCaption, setPostCaption] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postCaption || !location || !file) {
            setMessage("Please fill in all fields and select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("UserId", userData?.userId);
        formData.append("PostCaption", postCaption);
        formData.append("Location", location);
        formData.append("movieFile", file);

        try {
            const response = await fetch("http://localhost:5124/api/Post/create", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("Post created successfully!");
                setPostCaption("");
                setLocation("");
                setFile(null);
                navigate("/home");
            } else {
                const errorData = await response.json();
                setMessage(`Error: ${errorData.message || "Failed to create post"}`);
            }
        } catch (error) {
            setMessage("Error: Unable to create post. Please try again.");
            console.error("Error creating post:", error);
        }
    };

    return (

        <>
            <Navbar />

            <div className='f-container'>

                <div className="c-pad col-md-3">

                    <div style={{ marginTop: "6rem" }}>
                        <p style={{ marginBottom: "1rem" }}>Changed your mind?</p>
                        <Link className="btn btn-secondary" to="/home">Go Back</Link>
                    </div>

                </div>

                <div className="c-pad col-md-6">

                    <div className="text-center mb-3" style={{ marginTop: "7rem" }}>
                        <h1 className='display-6' style={{ color: "#a21fd1", marginBottom: "3rem", fontFamily: 'QueensidesMedium' }}>Create a new post!</h1>
                    </div>

                    <form style={{ marginTop: "3rem" }} onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="postCaption" className="form-label">Post Caption</label>
                            <input
                                type="text"
                                id="postCaption"
                                className="form-control"
                                placeholder='Express your thoughts!'
                                value={postCaption}
                                style={{ width: "90%" }}
                                onChange={(e) => setPostCaption(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                id="location"
                                placeholder='Mention your location!'
                                className="form-control"
                                value={location}
                                style={{ width: "90%" }}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="file" className="form-label">Upload File</label>
                            <input
                                type="file"
                                id="file"
                                className="form-control"
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                                style={{ width: "90%" }}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mt-3" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362", width: "90%" }}>Post it!</button>

                    </form>

                </div>

                <div className="c-pad col-md-3">

                </div>

            </div>

        </>
    );
};

export default CreatePost;