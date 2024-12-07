import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_END_POINT } from '../constants';

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;
    const navigate = useNavigate();

    const [selectedPost, setSelectedPost] = useState(null);
    const [editCaption, setEditCaption] = useState('');
    const [editLocation, setEditLocation] = useState('');

    const handleEditPost = (postId) => {
        const postToEdit = posts.find(post => post.postId === postId);
        if (postToEdit) {
            setSelectedPost(postToEdit);
            setEditCaption(postToEdit.postCaption);
            setEditLocation(postToEdit.location);
        }
    };

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_END_POINT}/api/Post/get-all-by-user/${userData.userId}`);
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
    }, [userId]);

    const handleDeletePost = async (postId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${API_END_POINT}/api/Post/delete/${postId}?userId=${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to delete post");
            }

            setPosts(posts.filter(post => post.postId !== postId)); // Remove post from the state
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePostSubmit = async (event) => {
        event.preventDefault();

        const updatedPost = {
            ...selectedPost,
            postCaption: editCaption,
            location: editLocation,
        };

        try {
            const response = await fetch(`${API_END_POINT}/api/Post/edit/${selectedPost.postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost),
            });

            if (!response.ok) {
                throw new Error("Failed to update post");
            }

            setPosts(posts.map(post => post.postId === selectedPost.postId ? updatedPost : post));
            setSelectedPost(null);

            const editModal = window.bootstrap.Modal.getInstance(document.getElementById("editPostModal"));
            editModal.hide();
        } catch (err) {
            alert(err.message);
        }
    };


    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="c-pad col-md-3 text-center">
                    <h1 className='display-6' style={{ color: "#a21fd1", fontFamily: 'QueensidesMedium', marginTop: "6rem" }}>Your Feed</h1>
                </div>

                <div className="align-items-center">
                    <p style={{ marginTop: '2rem' }}>Want to create a new post?</p>
                    <button className="btn btn-primary" onClick={() => navigate('/create')}>Create New</button>
                </div>

                <div className="row" style={{ marginTop: '2rem' }}>
                    {posts.map((post) => (
                        <div className="col-md-3 mb-4" key={post.postId}>
                            <div className="card shadow-sm">
                                <img src={post.s3Url} className="card-img-top" alt="Post" style={{ borderRadius: '10px', height: '200px', objectFit: 'cover', padding: "10px" }} />

                                <div className="card-body">
                                    <h5 className="card-title">{post.postCaption}</h5>
                                    <p className="card-text" style={{ color: "#a21fd1", marginTop: "2rem", fontFamily: 'QueensidesMedium' }}>< FontAwesomeIcon icon={faLocationDot} /> &nbsp;{post.location}</p>
                                    <p className="card-text" style={{ color: "#a21fd1", marginBottom: "2rem", fontFamily: 'QueensidesMedium' }}><FontAwesomeIcon icon={faCalendarDays} /> &nbsp;{new Date(post.postedDate).toLocaleDateString()}</p>

                                    <div>
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEditPost(post.postId)} data-bs-toggle="modal" data-bs-target="#editPostModal">
                                            Edit
                                        </button>
                                        <button className="btn btn-danger btn-sm" style={{ marginLeft: "5px" }} onClick={() => handleDeletePost(post.postId)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Edit Post Modal */}
            <div className="modal fade" id="editPostModal" tabIndex="-1" aria-labelledby="editPostModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handlePostSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="editPostModalLabel">Edit Post</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedPost(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="editCaption">Caption</label>
                                    <input
                                        id="editCaption"
                                        name="editCaption"
                                        className="form-control"
                                        value={editCaption}
                                        onChange={(e) => setEditCaption(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="editLocation">Location</label>
                                    <input
                                        id="editLocation"
                                        name="editLocation"
                                        className="form-control"
                                        value={editLocation}
                                        onChange={(e) => setEditLocation(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" data-bs-dismiss="modal" onClick={() => setSelectedPost(null)}>Close</button>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}>Update Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

};

export default ProfilePage;