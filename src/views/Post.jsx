import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../assets/css/Home.css';
import { faUser, faCalendarDays } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_END_POINT } from '../constants';

const Post = () => {

    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState("");

    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.userId;

    const [editCommentData, setEditCommentData] = useState({
        commentId: "",
        content: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`${API_END_POINT}/api/Post/get-by-id/${postId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch post details");
                }
                const data = await response.json();
                setPost(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetails();
    }, [postId]);

    const handleCommentSubmit = async (e) => {

        e.preventDefault();

        const commentRequest = {
            postId: postId,
            userId: userData?.userId,
            comment: comments
        };

        try {
            const response = await fetch(`${API_END_POINT}/api/Post/add-comment/${postId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(commentRequest),
            });

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            const updatedPost = await response.json();
            setPost(updatedPost);
            setComments("");
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditCommentClick = (comment) => {
        setEditCommentData({
            commentId: comment.commentId,
            content: comment.content,
        });
    };

    const handleEditCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_END_POINT}/api/Post/edit-comment/${postId}/${editCommentData.commentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: userData?.userId, content: editCommentData.content }),
            });

            if (!response.ok) {
                throw new Error("Failed to update comment");
            }

            const updatedPost = await response.json();
            setPost(updatedPost);

            const editModal = window.bootstrap.Modal.getInstance(document.getElementById("editCommentModal"));
            editModal.hide();

        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`${API_END_POINT}/api/Post/delete-comment/${postId}/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to delete comment");
            }
            const updatedPost = await response.json();

            setPost(updatedPost);
        } catch (err) {
            alert(err.message);
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
                        <p style={{ marginBottom: "1rem" }}>Changed your mind?</p>
                        <Link className="btn btn-secondary" to="/home">Go Back</Link>
                    </div>

                </div>

                <div className="c-pad col-md-6 text-center">

                    <div className="text-center mb-3" style={{ marginTop: "7rem" }}>
                        <h1 className='display-6' style={{ color: "#a21fd1", marginBottom: "3rem", fontFamily: 'QueensidesMedium' }}>< FontAwesomeIcon icon={faUser} /> &nbsp;&nbsp;{post.username}</h1>
                    </div>

                    <img src={post.s3Url} className="card-img-top" alt="Post Image" style={{ padding: "10px", borderRadius: "20px", width: "70%" }} />

                    <p style={{ color: "#ab448e" }}>< FontAwesomeIcon icon={faLocationDot} /> &nbsp;{post.location} &nbsp;&nbsp;|&nbsp;&nbsp; <FontAwesomeIcon icon={faCalendarDays} /> &nbsp; {post.postedDate ? new Date(post.postedDate).toLocaleDateString() : "Unknown Date"}</p>

                    <h5 className="card-title">{post.postCaption}</h5>

                    {post.comments && post.comments.length > 0 && (
                        <div className="mt-5">
                            <h4 className="mb-3" style={{ color: "#a21fd1", marginBottom: "3rem", fontFamily: 'QueensidesMedium' }}>Comments</h4>
                            <ul className="list-group" style={{ textAlign: "left" }}>
                                {post.comments.map((comment, index) => (
                                    <li className="list-group-item mb-1 mt-1 custom-tb" key={index}>
                                        <strong style={{ color: "#a21fd1", fontFamily: 'QueensidesMedium' }}>{comment.fullName}</strong>
                                        <br />
                                        {comment.content}

                                        <br /> <br />
                                        <small className="text-hint">
                                            {new Date(comment.postedAt).toLocaleString()}
                                        </small>
                                        <br />
                                        {comment.userId === userId && (
                                            <div>
                                                <button
                                                    className="btn btn-warning btn-sm mt-2"
                                                    data-bs-toggle="modal"
                                                    onClick={() => handleEditCommentClick(comment)}
                                                    data-bs-target="#editCommentModal">
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm mt-2 ms-2"
                                                    onClick={() => handleDeleteComment(comment.commentId)}>
                                                    Delete
                                                </button>

                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4">
                        <form className="align-items-center d-flex flex-column justify-content-center" onSubmit={handleCommentSubmit}>
                            <textarea
                                id="comments"
                                name="comments"
                                className="form-control mt-5"
                                rows="3"
                                placeholder="Write your comment here..."
                                style={{ width: "70%" }}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit" className="btn btn-primary mt-3" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362", marginBottom: "5rem", width: "70%" }}>Post it!</button>
                        </form>
                    </div>

                </div>

                <div className="c-pad col-md-3"></div>

            </div >

            <div className="modal fade" id="editCommentModal" tabIndex="-1" aria-labelledby="editCommentModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleEditCommentSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="editCommentModalLabel">Edit Comment</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <textarea
                                    id="editCommentContent"
                                    name="content"
                                    className="form-control"
                                    rows="3"
                                    value={editCommentData.content}
                                    onChange={(e) => setEditCommentData({ ...editCommentData, content: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-dark" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#dd6362", borderColor: "#dd6362" }}>Update Comment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

};

export default Post;