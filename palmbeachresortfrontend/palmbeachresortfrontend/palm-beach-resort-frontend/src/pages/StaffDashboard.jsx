import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import taskService from '../services/taskService';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [taskStats, setTaskStats] = useState({
        totalTasks: 0,
        todoCount: 0,
        inProgressCount: 0,
        doneCount: 0,
        overdueCount: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);
    const [recentComments, setRecentComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingTask, setUpdatingTask] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [stats, tasks] = await Promise.all([
                taskService.getStaffTaskStatistics(),
                taskService.getStaffTasks()
            ]);

            console.log('Real staff task statistics:', stats);
            console.log('Real staff tasks:', tasks);

            setTaskStats({
                totalTasks: stats.totalTasks || 0,
                todoCount: stats.todoCount || 0,
                inProgressCount: stats.inProgressCount || 0,
                doneCount: stats.doneCount || 0,
                overdueCount: stats.overdueCount || 0
            });

            // Get recent tasks (last 5)
            const recent = tasks.slice(0, 5);
            setRecentTasks(recent);

            // Load recent comments from tasks
            const comments = await loadRecentComments(recent);
            setRecentComments(comments);

        } catch (error) {
            console.error('Error loading real dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecentComments = async (tasks) => {
        try {
            const commentsPromises = tasks.map(task =>
                taskService.getTaskComments(task.id)
            );
            const commentsResults = await Promise.all(commentsPromises);

            const allComments = commentsResults.flat().slice(0, 5); // Get latest 5 comments
            return allComments.map(comment => ({
                ...comment,
                taskTitle: tasks.find(t => t.id === comment.taskId)?.title || 'Task'
            }));
        } catch (error) {
            console.error('Error loading comments:', error);
            return [];
        }
    };

    const handleQuickStatusUpdate = async (taskId, newStatus) => {
        try {
            setUpdatingTask(taskId);
            console.log('Quick updating task status:', taskId, newStatus);
            await taskService.updateStaffTaskStatus(taskId, { status: newStatus });

            // Reload data to reflect changes
            await loadDashboardData();
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status');
        } finally {
            setUpdatingTask(null);
        }
    };

    const navigateToTasks = () => {
        navigate('/staff/tasks');
    };

    const navigateToTaskDetails = (taskId) => {
        navigate(`/staff/tasks/${taskId}`);
    };

    const navigateToMyTasks = () => {
        navigate('/staff/tasks');
    };

    const navigateToInProgress = () => {
        navigate('/staff/tasks?status=IN_PROGRESS');
    };

    const navigateToOverdue = () => {
        navigate('/staff/tasks?filter=overdue');
    };

    const navigateToToday = () => {
        navigate('/staff/tasks?filter=today');
    };

    const handleManageReservations = () => {
        // Add your reservations navigation logic here
        console.log('Navigate to reservations management');
        navigate('/admin/bookings'); // Assuming staff can access bookings
    };

    const handleViewGuests = () => {
        // Add your guests navigation logic here
        console.log('Navigate to guests view');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const getStatusBadgeClass = (status) => {
        const statusMap = {
            'TODO': 'status-todo',
            'IN_PROGRESS': 'status-in_progress',
            'DONE': 'status-done',
            'CANCELLED': 'status-cancelled'
        };
        return statusMap[status] || 'status-todo';
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Staff Dashboard</h1>
                <p>Welcome back, {user?.fullName}!</p>
            </div>

            <div className="dashboard-content">
                {/* Task Management Section */}
                <div className="dashboard-section">
                    <h2>Task Management</h2>

                    {/* Task Statistics Cards */}
                    <div className="stats-grid">
                        <div className="stat-card" onClick={navigateToMyTasks}>
                            <div className="stat-icon">📋</div>
                            <div className="stat-content">
                                <div className="stat-number">{taskStats.totalTasks}</div>
                                <div className="stat-label">Total Tasks</div>
                            </div>
                        </div>

                        <div className="stat-card todo" onClick={navigateToMyTasks}>
                            <div className="stat-icon">⏳</div>
                            <div className="stat-content">
                                <div className="stat-number">{taskStats.todoCount}</div>
                                <div className="stat-label">To Do</div>
                            </div>
                        </div>

                        <div className="stat-card in-progress" onClick={navigateToInProgress}>
                            <div className="stat-icon">🔄</div>
                            <div className="stat-content">
                                <div className="stat-number">{taskStats.inProgressCount}</div>
                                <div className="stat-label">In Progress</div>
                            </div>
                        </div>

                        <div className="stat-card done">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{taskStats.doneCount}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>

                        <div className="stat-card overdue" onClick={navigateToOverdue}>
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-content">
                                <div className="stat-number">{taskStats.overdueCount}</div>
                                <div className="stat-label">Overdue</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Task Actions */}
                    <div className="quick-task-section">
                        <div className="section-header">
                            <h3>Quick Task Actions</h3>
                            <button className="view-all-btn" onClick={navigateToTasks}>
                                View All Tasks →
                            </button>
                        </div>

                        <div className="action-buttons-grid">
                            <button className="action-btn primary large" onClick={navigateToTasks}>
                                <span className="btn-icon">📋</span>
                                <span className="btn-text">View All Tasks</span>
                            </button>

                            <button className="action-btn secondary large" onClick={navigateToInProgress}>
                                <span className="btn-icon">🔄</span>
                                <span className="btn-text">In Progress Tasks</span>
                                {taskStats.inProgressCount > 0 && (
                                    <span className="task-badge">{taskStats.inProgressCount}</span>
                                )}
                            </button>

                            <button className="action-btn warning large" onClick={navigateToOverdue}>
                                <span className="btn-icon">⚠️</span>
                                <span className="btn-text">Overdue Tasks</span>
                                {taskStats.overdueCount > 0 && (
                                    <span className="task-badge urgent">{taskStats.overdueCount}</span>
                                )}
                            </button>

                            <button className="action-btn info large" onClick={navigateToToday}>
                                <span className="btn-icon">📅</span>
                                <span className="btn-text">Due Today</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Tasks with Quick Actions */}
                    <div className="recent-tasks-section">
                        <div className="section-header">
                            <h3>Recent Tasks</h3>
                            <span className="section-subtitle">Quick updates for your most recent tasks</span>
                        </div>

                        {loading ? (
                            <div className="loading-tasks">
                                <div className="loading-spinner"></div>
                                <span>Loading tasks...</span>
                            </div>
                        ) : recentTasks.length > 0 ? (
                            <div className="tasks-list">
                                {recentTasks.map(task => (
                                    <div key={task.id} className="task-item">
                                        <div className="task-main-info">
                                            <div className="task-header">
                                                <h4
                                                    className="task-title"
                                                    onClick={() => navigateToTaskDetails(task.id)}
                                                >
                                                    {task.title}
                                                </h4>
                                                <div className="task-meta">
                                                    <span className={`priority-badge ${getPriorityBadgeClass(task.priority)}`}>
                                                        {task.priority.toLowerCase()}
                                                    </span>
                                                    <span className={`status-badge ${getStatusBadgeClass(task.status)}`}>
                                                        {task.status.replace('_', ' ').toLowerCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {task.description && (
                                                <p className="task-description">
                                                    {task.description.length > 100
                                                        ? `${task.description.substring(0, 100)}...`
                                                        : task.description
                                                    }
                                                </p>
                                            )}

                                            <div className="task-details">
                                                <span className="due-date">
                                                    Due: {formatDate(task.dueDate)}
                                                    {isOverdue(task.dueDate) && task.status !== 'DONE' && (
                                                        <span className="overdue-indicator"> (Overdue)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="task-actions">
                                            {task.status === 'TODO' && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleQuickStatusUpdate(task.id, 'IN_PROGRESS')}
                                                    disabled={updatingTask === task.id}
                                                >
                                                    {updatingTask === task.id ? '...' : 'Start Task'}
                                                </button>
                                            )}

                                            {task.status === 'IN_PROGRESS' && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => handleQuickStatusUpdate(task.id, 'DONE')}
                                                    disabled={updatingTask === task.id}
                                                >
                                                    {updatingTask === task.id ? '...' : 'Mark Complete'}
                                                </button>
                                            )}

                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => navigateToTaskDetails(task.id)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-tasks">
                                <div className="no-tasks-icon">📋</div>
                                <p>No tasks assigned to you yet.</p>
                                <p className="no-tasks-subtitle">Tasks assigned to you will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity & Comments */}
                <div className="recent-activity-section">
                    <h3>Recent Activity</h3>

                    {loading ? (
                        <div className="loading-tasks">
                            <div className="loading-spinner"></div>
                            <span>Loading activity...</span>
                        </div>
                    ) : recentComments.length > 0 ? (
                        <div className="activity-list">
                            {recentComments.map(comment => (
                                <div key={comment.id} className="activity-item">
                                    <div className="activity-icon">💬</div>
                                    <div className="activity-content">
                                        <div className="activity-message">
                                            <strong>{comment.userName}</strong> commented on "{comment.taskTitle}"
                                        </div>
                                        <div className="activity-comment">
                                            {comment.comment.length > 80
                                                ? `${comment.comment.substring(0, 80)}...`
                                                : comment.comment
                                            }
                                        </div>
                                        <div className="activity-time">
                                            {formatDateTime(comment.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-activity">
                            <div className="no-activity-icon">💬</div>
                            <p>No recent activity</p>
                            <p className="no-activity-subtitle">Comments and updates will appear here.</p>
                        </div>
                    )}
                </div>

                {/* User Information Card */}
                <div className="user-info-card">
                    <h2>Staff Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name:</label>
                            <span>{user?.fullName}</span>
                        </div>
                        <div className="info-item">
                            <label>Email:</label>
                            <span>{user?.email}</span>
                        </div>
                        <div className="info-item">
                            <label>Role:</label>
                            <span className="role-badge staff">{user?.role}</span>
                        </div>
                        <div className="info-item">
                            <label>Staff ID:</label>
                            <span>{user?.userId}</span>
                        </div>
                    </div>
                </div>

                {/* Other Dashboard Actions */}
                <div className="dashboard-actions">
                    <button className="action-btn primary" onClick={handleManageReservations}>
                        <span className="btn-icon">🏨</span>
                        <span className="btn-text">Manage Reservations</span>
                    </button>
                    <button className="action-btn secondary" onClick={handleViewGuests}>
                        <span className="btn-icon">👥</span>
                        <span className="btn-text">View Guests</span>
                    </button>
                    <button className="action-btn logout" onClick={logout}>
                        <span className="btn-icon">🚪</span>
                        <span className="btn-text">Logout</span>
                    </button>
                </div>

                {/* Quick Task Overview */}
                <div className="quick-tasks-overview">
                    <h3>Task Summary</h3>
                    {loading ? (
                        <div className="loading-tasks">
                            <div className="loading-spinner"></div>
                            <span>Loading task data...</span>
                        </div>
                    ) : (
                        <div className="tasks-summary">
                            {taskStats.todoCount === 0 && taskStats.inProgressCount === 0 ? (
                                <div className="no-pending-tasks">
                                    <p>🎉 No pending tasks! You're all caught up.</p>
                                </div>
                            ) : (
                                <>
                                    {taskStats.todoCount > 0 && (
                                        <div className="task-alert info">
                                            <strong>{taskStats.todoCount} task(s)</strong> waiting to be started
                                        </div>
                                    )}
                                    {taskStats.inProgressCount > 0 && (
                                        <div className="task-alert warning">
                                            <strong>{taskStats.inProgressCount} task(s)</strong> in progress
                                        </div>
                                    )}
                                    {taskStats.overdueCount > 0 && (
                                        <div className="task-alert urgent">
                                            <strong>{taskStats.overdueCount} task(s)</strong> are overdue and need immediate attention
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;