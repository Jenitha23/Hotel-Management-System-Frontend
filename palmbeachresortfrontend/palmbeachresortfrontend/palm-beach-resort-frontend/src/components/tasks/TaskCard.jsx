import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './TaskCard.css';

const TaskCard = ({ task, onStatusUpdate, onDelete, showActions = true }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Calculate overdue status based on due_date from database
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE' && task.status !== 'CANCELLED';
    const isDueToday = task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString();

    const handleViewDetails = () => {
        if (user?.role === 'ADMIN') {
            navigate(`/admin/tasks/${task.id}`);
        } else if (user?.role === 'STAFF') {
            navigate(`/staff/tasks/${task.id}`);
        }
    };

    const handleEdit = () => {
        navigate(`/admin/tasks/edit/${task.id}`);
    };

    const handleStatusChange = (newStatus) => {
        if (onStatusUpdate) {
            onStatusUpdate(task.id, newStatus);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPriorityClass = (priority) => {
        const priorityMap = {
            'LOW': 'priority-low',
            'MEDIUM': 'priority-medium',
            'HIGH': 'priority-high',
            'URGENT': 'priority-urgent'
        };
        return priorityMap[priority] || 'priority-medium';
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'TODO': 'status-todo',
            'IN_PROGRESS': 'status-in_progress',
            'DONE': 'status-done',
            'CANCELLED': 'status-cancelled'
        };
        return statusMap[status] || 'status-todo';
    };

    return (
        <div className={`task-card ${isOverdue ? 'overdue' : ''} ${task.priority === 'URGENT' ? 'urgent' : ''}`}>
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
          <span className={`task-priority ${getPriorityClass(task.priority)}`}>
            {task.priority?.toLowerCase() || 'medium'}
          </span>
                    <span className={`task-status ${getStatusClass(task.status)}`}>
            {task.status?.replace('_', ' ').toLowerCase() || 'todo'}
          </span>
                </div>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-details">
                <div className="task-assignee">
                    <div className="assignee-avatar">
                        {task.assignedToName ? task.assignedToName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span>{task.assignedToName || 'Unassigned'}</span>
                </div>
                <div className="task-due-date">
                    <span>Due:</span>
                    <span className={`due-date ${isOverdue ? 'overdue' : ''} ${isDueToday ? 'today' : ''}`}>
            {formatDate(task.dueDate)}
          </span>
                </div>
            </div>

            {showActions && (
                <div className="task-actions">
                    <button className="btn-sm btn-outline" onClick={handleViewDetails}>
                        View
                    </button>

                    {user?.role === 'ADMIN' && (
                        <>
                            <button className="btn-sm btn-outline" onClick={handleEdit}>
                                Edit
                            </button>
                            <button
                                className="btn-sm btn-danger"
                                onClick={() => onDelete(task.id)}
                            >
                                Delete
                            </button>
                        </>
                    )}

                    {user?.role === 'STAFF' && task.status !== 'DONE' && task.status !== 'CANCELLED' && (
                        <div className="status-actions">
                            {task.status === 'TODO' && (
                                <button
                                    className="btn-sm btn-primary"
                                    onClick={() => handleStatusChange('IN_PROGRESS')}
                                >
                                    Start
                                </button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                                <button
                                    className="btn-sm btn-primary"
                                    onClick={() => handleStatusChange('DONE')}
                                >
                                    Complete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskCard;