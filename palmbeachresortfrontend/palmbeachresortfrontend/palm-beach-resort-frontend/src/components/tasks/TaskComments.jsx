import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import './TaskComments.css';

const TaskComments = ({ taskId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [taskId]);

    const loadComments = async () => {
        try {
            setLoading(true);
            const commentsData = await taskService.getTaskComments(taskId);
            setComments(commentsData);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const commentData = { comment: newComment };

            let newCommentData;
            if (user.role === 'ADMIN') {
                newCommentData = await taskService.addComment(taskId, commentData);
            } else {
                newCommentData = await taskService.addStaffComment(taskId, commentData);
            }

            setComments(prev => [newCommentData, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getUserInitial = (userName) => {
        return userName ? userName.charAt(0).toUpperCase() : 'U';
    };

    if (loading) {
        return (
            <div className="task-comments">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="task-comments">
            <div className="comments-header">
                <h3 className="comments-title">Comments</h3>
                <span className="comments-count">{comments.length}</span>
            </div>

            <form className="comment-form" onSubmit={handleSubmitComment}>
        <textarea
            className="comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
        />
                <div className="comment-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting || !newComment.trim()}
                    >
                        {submitting ? 'Adding...' : 'Add Comment'}
                    </button>
                </div>
            </form>

            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-user">
                                    <div className="user-avatar">
                                        {getUserInitial(comment.userName)}
                                    </div>
                                    <div className="user-info">
                                        <div className="user-name">{comment.userName}</div>
                                        <div className="user-role">{comment.userRole.toLowerCase()}</div>
                                    </div>
                                </div>
                                <div className="comment-time">
                                    {formatDateTime(comment.createdAt)}
                                </div>
                            </div>
                            <div className="comment-content">
                                {comment.comment}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-comments">
                        <div className="no-comments-icon">💬</div>
                        <p>No comments yet. Start the conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskComments;