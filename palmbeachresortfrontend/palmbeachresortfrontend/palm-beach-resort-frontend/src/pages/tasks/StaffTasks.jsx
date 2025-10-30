import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../../components/tasks/TaskCard';
import taskService from '../../services/taskService';
import './StaffTasks.css';

const StaffTasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        loadStaffData();
    }, []);

    const loadStaffData = async () => {
        try {
            setLoading(true);
            const [tasksData, statsData] = await Promise.all([
                taskService.getStaffTasks(),
                taskService.getStaffTaskStatistics()
            ]);
            console.log('Staff tasks loaded:', tasksData);
            console.log('Staff statistics loaded:', statsData);
            setTasks(tasksData);
            setStatistics(statsData);
        } catch (error) {
            console.error('Error loading staff tasks:', error);
            alert('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            console.log('Updating staff task status:', taskId, newStatus);
            await taskService.updateStaffTaskStatus(taskId, { status: newStatus });
            await loadStaffData(); // Reload to get updated data
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/staff-dashboard');
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    const getOverdueTasks = () => {
        return tasks.filter(task => task.overdue && task.status !== 'DONE' && task.status !== 'CANCELLED');
    };

    if (loading) {
        return (
            <div className="staff-tasks">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="staff-tasks">
            {/* Header with Back Button */}
            <div className="staff-tasks-header">

                <div className="header-content">
                    <h1 className="staff-tasks-title">My Tasks</h1>
                    <p className="staff-tasks-subtitle">
                        Welcome back, {user?.fullName}. Here are your assigned tasks.
                    </p>
                </div>
            </div>

            {/* Statistics Section */}
            {statistics && (
                <div className="stats-section">
                    <h2 className="stats-title">Task Overview</h2>
                    <div className="staff-tasks-stats">
                        <div className="stat-card stat-todo">
                            <div className="stat-icon">📋</div>
                            <div className="stat-content">
                                <div className="stat-number">{statistics.todoCount || 0}</div>
                                <div className="stat-label">To Do</div>
                            </div>
                        </div>
                        <div className="stat-card stat-in-progress">
                            <div className="stat-icon">🔄</div>
                            <div className="stat-content">
                                <div className="stat-number">{statistics.inProgressCount || 0}</div>
                                <div className="stat-label">In Progress</div>
                            </div>
                        </div>
                        <div className="stat-card stat-done">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-number">{statistics.doneCount || 0}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                        <div className="stat-card stat-overdue">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-content">
                                <div className="stat-number">{statistics.overdueCount || 0}</div>
                                <div className="stat-label">Overdue</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks Sections */}
            <div className="tasks-container">
                {/* Overdue Tasks */}
                {getOverdueTasks().length > 0 && (
                    <div className="tasks-section overdue-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="section-icon">⚠️</span>
                                Overdue Tasks
                            </h2>
                            <span className="task-count">{getOverdueTasks().length}</span>
                        </div>
                        <div className="tasks-grid">
                            {getOverdueTasks().map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusUpdate={handleStatusUpdate}
                                    userRole={user?.role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* To Do Tasks */}
                {getTasksByStatus('TODO').length > 0 && (
                    <div className="tasks-section todo-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="section-icon">📋</span>
                                To Do
                            </h2>
                            <span className="task-count">{getTasksByStatus('TODO').length}</span>
                        </div>
                        <div className="tasks-grid">
                            {getTasksByStatus('TODO').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusUpdate={handleStatusUpdate}
                                    userRole={user?.role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* In Progress Tasks */}
                {getTasksByStatus('IN_PROGRESS').length > 0 && (
                    <div className="tasks-section progress-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="section-icon">🔄</span>
                                In Progress
                            </h2>
                            <span className="task-count">{getTasksByStatus('IN_PROGRESS').length}</span>
                        </div>
                        <div className="tasks-grid">
                            {getTasksByStatus('IN_PROGRESS').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusUpdate={handleStatusUpdate}
                                    userRole={user?.role}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Tasks */}
                {getTasksByStatus('DONE').length > 0 && (
                    <div className="tasks-section done-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="section-icon">✅</span>
                                Completed
                            </h2>
                            <span className="task-count">{getTasksByStatus('DONE').length}</span>
                        </div>
                        <div className="tasks-grid">
                            {getTasksByStatus('DONE').map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusUpdate={handleStatusUpdate}
                                    userRole={user?.role}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {tasks.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3 className="empty-title">No tasks assigned</h3>
                        <p className="empty-description">
                            You don't have any tasks assigned to you yet. Check back later or contact your administrator.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffTasks;