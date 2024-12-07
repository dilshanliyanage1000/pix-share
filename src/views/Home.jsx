import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/Home.css';
import { faUser, faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faHeart as fullHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faHeart as emptyHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_END_POINT } from '../constants';

const Home = () => {

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_END_POINT}/api/Post/get-all`);

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            const data = await response.json();

            const sortedPosts = data.sort((a, b) => {
                const dateA = new Date(a.postedDate);
                const dateB = new Date(b.postedDate);
                return dateB - dateA;
            });

            setPosts(sortedPosts);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLikeClick = async (postId) => {

        try {
            const response = await fetch(`${API_END_POINT}/api/Like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, postId: postId })
            });

            if (!response.ok) {
                throw new Error("Failed to send post data");
            }

            fetchPosts();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleDislikeClick = async (postId) => {

        try {
            const response = await fetch(`${API_END_POINT}/api/Like`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userId, postId: postId })
            });

            if (!response.ok) {
                throw new Error("Failed to send post data");
            }

            fetchPosts();
        } catch (error) {
            console.error("Error:", error);
        }
    };


    const handlePasswordChange = async (e) => {

        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch(`${API_END_POINT}/api/User/update-password/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
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


                </div>

                <div className="c-pad col-md-6">

                    <div className="text-center" style={{ marginTop: "5rem" }}>
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

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                        <div style={{ display: "flex", alignItems: "center" }}>

                                            {post.likesList.some(like => like.userId === userId) ? (
                                                <FontAwesomeIcon
                                                    icon={fullHeart}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "24px",
                                                        color: "#f54242",
                                                        marginRight: "50%",
                                                    }}
                                                    onClick={() => handleDislikeClick(post.postId)}
                                                    title="Like Post"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={emptyHeart}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "24px",
                                                        color: "#8f8f8f",
                                                        marginRight: "50%",
                                                    }}
                                                    onClick={() => handleLikeClick(post.postId)}
                                                    title="Like Post"
                                                />
                                            )}

                                            {/* {post.likesList?.includes(userId) ? (
                                                <FontAwesomeIcon
                                                    icon={fullHeart}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "24px",
                                                        color: "#8f8f8f",
                                                        marginRight: "50%",
                                                    }}
                                                    onClick={() => handleLikeClick(post.postId)}
                                                    title="Unlike Post"
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={emptyHeart}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "24px",
                                                        color: "#8f8f8f",
                                                        marginRight: "50%",
                                                    }}
                                                    onClick={() => handleLikeClick(post.postId)}
                                                    title="Like Post"
                                                />
                                            )} */}

                                            <Link to={`/post/${post.postId}`}>
                                                <FontAwesomeIcon
                                                    icon={faComment}
                                                    style={{
                                                        cursor: "pointer",
                                                        fontSize: "24px",
                                                        color: "#8f8f8f",
                                                    }}
                                                    title="Comment on Post"
                                                />
                                            </Link>

                                        </div>

                                        <span className="text-muted" style={{ fontSize: "14px" }}>
                                            {post.likesCount} likes • {post.commentsCount} comments
                                        </span>
                                    </div>

                                    <h6 className="card-title mt-4"><span style={{ color: "#a21fd1", fontFamily: 'QueensidesMedium', fontWeight: "bold" }}>@{post.username}</span> {post.postCaption}</h6>

                                    <p className="card-text mt-4" style={{ color: "#ab448e", fontFamily: 'QueensidesMedium', fontWeight: "bold" }}>< FontAwesomeIcon icon={faLocationDot} /> &nbsp;{post.location} &nbsp;•&nbsp;&nbsp;<FontAwesomeIcon icon={faCalendarDays} /> &nbsp; {post.postedDate ? new Date(post.postedDate).toLocaleDateString() : "Unknown Date"}</p>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

                <div className="c-pad col-md-3">



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
                                    type="password"
                                    className="form-control"
                                    placeholder='Please enter your desired password!'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                ></input>
                                <input
                                    id="confirmPassword"
                                    name="content"
                                    type="password"
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