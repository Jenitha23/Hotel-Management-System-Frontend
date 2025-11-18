import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import './TaskDetails.css';

const TaskDetails = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const isAdmin = user?.role === 'ADMIN';
    const isStaff = user?.role === 'STAFF';
    const isAssignedStaff = isStaff && task?.assignedTo === user?.id;

    useEffect(() => {
        loadTaskDetails();
    }, [taskId]);

    // REAL: Load actual task data and comments from backend
    const loadTaskDetails = async () => {
        try {
            setLoading(true);
            console.log('Loading REAL task details for ID:', taskId);

            let taskData;
            if (isAdmin) {
                taskData = await taskService.getTaskById(taskId);
            } else if (isStaff) {
                taskData = await taskService.getStaffTask(taskId);
            }

            console.log('REAL Task data loaded from backend:', taskData);
            setTask(taskData);

            // Load REAL comments from backend
            const commentsData = await taskService.getTaskComments(taskId);
            console.log('REAL Comments loaded from backend:', commentsData);
            setComments(commentsData);
        } catch (error) {
            console.error('Error loading REAL task details:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Unable to load task details: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // REAL: Update status using actual backend API
    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdatingStatus(true);
            console.log('Updating REAL task status to:', newStatus);

            const statusData = { status: newStatus };

            if (isAdmin) {
                await taskService.updateTaskStatus(taskId, statusData);
            } else if (isStaff) {
                await taskService.updateStaffTaskStatus(taskId, statusData);
            }

            await loadTaskDetails(); // Reload to get updated task from backend
            alert('Task status updated successfully!');
        } catch (error) {
            console.error('Error updating REAL task status:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Failed to update task status: ${errorMessage}`);
        } finally {
            setUpdatingStatus(false);
        }
    };

    // REAL: Add comment using actual backend API
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            console.log('Adding REAL comment:', newComment);

            const commentData = { comment: newComment };
            let newCommentData;

            if (isAdmin) {
                newCommentData = await taskService.addComment(taskId, commentData);
            } else if (isStaff) {
                newCommentData = await taskService.addStaffComment(taskId, commentData);
            }

            console.log('REAL Comment added from backend:', newCommentData);
            setComments(prev => [newCommentData, ...prev]);
            setNewComment('');
            alert('Comment added successfully!');
        } catch (error) {
            console.error('Error adding REAL comment:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Failed to add comment: ${errorMessage}`);
        } finally {
            setSubmittingComment(false);
        }
    };

    // REAL: Delete task using actual backend API
    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            try {
                await taskService.deleteTask(taskId);
                alert('Task deleted successfully');
                navigate('/admin/tasks');
            } catch (error) {
                console.error('Error deleting REAL task:', error);
                const errorMessage = error.response?.data?.message || error.message;
                alert(`Failed to delete task: ${errorMessage}`);
            }
        }
    };

    // REAL: Assign task using actual backend API
    const handleAssignToMe = async () => {
        try {
            await taskService.assignTask(taskId, user.id);
            await loadTaskDetails(); // Reload to get updated task from backend
            alert('Task assigned to you successfully');
        } catch (error) {
            console.error('Error assigning REAL task:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Failed to assign task: ${errorMessage}`);
        }
    };

    const handleEditTask = () => {
        navigate(`/admin/tasks/edit/${taskId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'TODO': 'status-todo',
            'IN_PROGRESS': 'status-in_progress',
            'DONE': 'status-done',
            'CANCELLED': 'status-cancelled'
        };
        return statusMap[status] || 'status-todo';
    };

    const getPriorityBadgeClass = (priority) => {
        const priorityMap = {
            'LOW': 'priority-low',
            'MEDIUM': 'priority-medium',
            'HIGH': 'priority-high',
            'URGENT': 'priority-urgent'
        };
        return priorityMap[priority] || 'priority-medium';
    };

    if (loading) {
        return (
            <div className="task-details">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading real task data from backend...</p>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="task-details">
                <div className="empty-state">
                    <h2>Task Not Found</h2>
                    <p>The requested task could not be found in the backend.</p>
                    <button
                        className="back-button"
                        onClick={() => navigate(isAdmin ? '/admin/tasks' : '/staff/tasks')}
                    >
                        ← Back to Tasks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="task-details">
            {/* New Header with Title and Buttons */}
            <div className="task-details-header">
                <button
                    className="back-button"
                    onClick={() => navigate(isAdmin ? '/admin/tasks' : '/staff/tasks')}
                >
                    ← Back to Tasks
                </button>

                <div className="header-title">
                    <h1>View Details</h1>
                </div>

                {isAdmin && (
                    <div className="header-actions">
                        <button
                            className="edit-task-btn"
                            onClick={handleEditTask}
                        >
                            Edit Task
                        </button>
                    </div>
                )}
            </div>

            <div className="task-details-content">
                <div className="task-main">
                    <div className="task-info-section">
                        <h1 className="task-title">{task.title}</h1>

                        {task.description && (
                            <p className="task-description">{task.description}</p>
                        )}

                        <div className="task-meta-grid">
                            <div className="meta-item">
                                <span className="meta-label">Status</span>
                                <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-label">Priority</span>
                                <span className={`priority-badge ${getPriorityBadgeClass(task.priority)}`}>
                                    {task.priority.toLowerCase()}
                                </span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-label">Due Date</span>
                                <span className={`meta-value ${task.overdue ? 'overdue' : ''}`}>
                                    {formatDate(task.dueDate)}
                                    {task.overdue && <span className="overdue-badge">Overdue</span>}
                                </span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-label">Assigned To</span>
                                <span className="meta-value">
                                    {task.assignedToName || 'Unassigned'}
                                </span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-label">Created By</span>
                                <span className="meta-value">{task.createdByName}</span>
                            </div>

                            <div className="meta-item">
                                <span className="meta-label">Created On</span>
                                <span className="meta-value">{formatDateTime(task.createdAt)}</span>
                            </div>

                            {task.completedAt && (
                                <div className="meta-item">
                                    <span className="meta-label">Completed On</span>
                                    <span className="meta-value">{formatDateTime(task.completedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="comments-section">
                        <h3 className="section-title">Comments & Activity</h3>

                        <form className="comment-form" onSubmit={handleAddComment}>
                            <textarea
                                className="comment-textarea"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={submittingComment}
                            />
                            <button
                                type="submit"
                                className="comment-submit"
                                disabled={submittingComment || !newComment.trim()}
                            >
                                {submittingComment ? 'Adding Comment...' : 'Add Comment'}
                            </button>
                        </form>

                        <div className="comments-list">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <div className="comment-header">
                                            <div>
                                                <span className="comment-author">{comment.userName}</span>
                                                <span className="comment-role">{comment.userRole}</span>
                                            </div>
                                            <span className="comment-time">
                                                {formatDateTime(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="no-comments">
                                    <p>No comments yet. Be the first to comment!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="task-sidebar">
                    <div className="task-actions-sidebar">
                        <h3 className="section-title">Actions</h3>
                        <div className="action-buttons">
                            {/* Status Update Buttons - REAL backend calls */}
                            {isAssignedStaff && task.status === 'TODO' && (
                                <button
                                    className="action-button primary"
                                    onClick={() => handleStatusUpdate('IN_PROGRESS')}
                                    disabled={updatingStatus}
                                >
                                    {updatingStatus ? 'Updating...' : 'Start Task'}
                                </button>
                            )}

                            {isAssignedStaff && task.status === 'IN_PROGRESS' && (
                                <button
                                    className="action-button primary"
                                    onClick={() => handleStatusUpdate('DONE')}
                                    disabled={updatingStatus}
                                >
                                    {updatingStatus ? 'Updating...' : 'Mark Complete'}
                                </button>
                            )}

                            {isAdmin && !task.assignedTo && (
                                <button
                                    className="action-button primary"
                                    onClick={handleAssignToMe}
                                >
                                    Assign to Me
                                </button>
                            )}

                            {isAdmin && (
                                <>
                                    <button
                                        className="action-button danger"
                                        onClick={handleDeleteTask}
                                    >
                                        Delete Task
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="task-info-sidebar">
                        <h3 className="section-title">Task Information</h3>
                        <div className="sidebar-info">
                            <div className="info-item">
                                <strong>Task ID:</strong> {task.id}
                            </div>
                            <div className="info-item">
                                <strong>Last Updated:</strong> {formatDateTime(task.updatedAt)}
                            </div>
                            {task.overdue && (
                                <div className="info-item overdue">
                                    <strong>Status:</strong> This task is overdue!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;