import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/Home.css';
import { faUser, faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Home = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]); // State to store posts
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const [showModal, setShowModal] = useState(false); // Modal show state
    const [newPassword, setNewPassword] = useState(""); // New password state
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:5124/api/Post/get-all");
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePasswordChange = async (e) => {

        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5124/api/User/update-password/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ NewPassword: newPassword }),
            });

            if (response.ok) {
                alert("Password updated successfully");
                setShowModal(false);

                const editModal = window.bootstrap.Modal.getInstance(document.getElementById("editPasswordModal"));
                editModal.hide();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <Navbar />

            <div className='f-container'>

                <div className="c-pad col-md-3">

                    <div style={{ marginTop: "6rem" }}>
                        <p style={{ marginBottom: "1rem" }}>Want to share your thoughts? Express your feelings?</p>
                        <Link className="btn btn-primary" to="/create" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}>Create Post</Link>
                    </div>

                    <div style={{ marginTop: "4rem" }}>
                        <p style={{ marginBottom: "1rem" }}>Forgot your password?</p>
                        <Link className="btn btn-dark"
                            data-bs-toggle="modal"
                            data-bs-target="#editPasswordModal">Change password</Link>
                    </div>


                </div>

                <div className="c-pad col-md-6">

                    <div className="text-center" style={{ marginTop: "6rem" }}>
                        <h1 className='display-6' style={{ color: "#a21fd1", fontFamily: 'QueensidesMedium' }}>Post Feed</h1>
                    </div>

                    <div className="mt-3 center-container">
                        {posts.map((post) => (
                            <div
                                key={post.postId}
                                className="card mb-3 rounded"
                                style={{ width: "400px" }}
                            >
                                <div className='card-header' style={{ color: "#4a2f69", fontWeight: "bold", fontFamily: 'QueensidesMedium' }}> < FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;{post.fullName}&nbsp;(@{post.username})</div>
                                {post.s3Url && (
                                    <img src={post.s3Url} className="card-img-top" alt="Post Image" style={{ padding: "10px", borderRadius: "20px" }} />
                                )}
                                <div className="card-body">
                                    <p className="card-text" style={{ color: "#ab448e", fontFamily: 'QueensidesMedium', fontWeight: "bold" }}>< FontAwesomeIcon icon={faLocationDot} /> &nbsp;{post.location}</p>
                                    <h5 className="card-title">{post.postCaption}</h5>
                                    <p className="card-text mt-4" style={{ color: "#ab448e", fontFamily: 'QueensidesMedium' }}> <FontAwesomeIcon icon={faCalendarDays} /> &nbsp; {post.postedDate ? new Date(post.postedDate).toLocaleDateString() : "Unknown Date"}</p>
                                </div>
                                <div className="card-footer" style={{ textAlign: "end" }}>
                                    <Link style={{ textDecoration: "none", color: "red", fontWeight: "bold" }} to={`/post/${post.postId}`} >
                                        View Comments
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>

                <div className="c-pad col-md-3">

                    <div style={{ marginTop: "6rem", textAlign: "right" }}>
                        <p style={{ marginBottom: "1rem" }}>Check your posts? Update your thoughts?</p>
                        <Link className="btn btn-dark" to="/profile" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}>Your Feed</Link>
                    </div>

                </div>

            </div>

            <div className="modal fade" id="editPasswordModal" tabIndex="-1" aria-labelledby="editPasswordModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handlePasswordChange}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="editPasswordModalLabel">Change Password?</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    id="newPassword"
                                    name="content"
                                    className="form-control"
                                    placeholder='Please enter your desired password!'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                ></input>
                                <input
                                    id="confirmPassword"
                                    name="content"
                                    className="form-control mt-3"
                                    placeholder='Please enter password again!'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                ></input>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}>Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </>
    );

};

export default Home;