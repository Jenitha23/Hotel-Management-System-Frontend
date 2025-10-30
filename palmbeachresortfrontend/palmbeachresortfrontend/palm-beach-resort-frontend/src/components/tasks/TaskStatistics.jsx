import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import './TaskStatistics.css';

const TaskStatistics = () => {
    const { user } = useAuth();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            let statsData;
            if (user?.role === 'ADMIN') {
                statsData = await taskService.getTaskStatistics();
            } else if (user?.role === 'STAFF') {
                statsData = await taskService.getStaffTaskStatistics();
            }
            console.log('Statistics loaded:', statsData);
            setStatistics(statsData);
        } catch (error) {
            console.error('Error loading statistics:', error);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="task-statistics">
                <h3 className="stats-title">Task Statistics</h3>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="task-statistics">
                <h3 className="stats-title">Task Statistics</h3>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="task-statistics">
                <h3 className="stats-title">Task Statistics</h3>
                <p>No statistics available</p>
            </div>
        );
    }

    return (
        <div className="task-statistics">
            <h3 className="stats-title">Task Statistics</h3>
            <div className="stats-grid">
                <div className="stat-item total">
                    <div className="stat-info">
                        <span className="stat-icon">📊</span>
                        <div className="stat-text">
                            <span className="stat-label">Total Tasks</span>
                            <span className="stat-value">{statistics.totalTasks || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-item todo">
                    <div className="stat-info">
                        <span className="stat-icon">⏳</span>
                        <div className="stat-text">
                            <span className="stat-label">To Do</span>
                            <span className="stat-value">{statistics.todoCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-item in-progress">
                    <div className="stat-info">
                        <span className="stat-icon">🔄</span>
                        <div className="stat-text">
                            <span className="stat-label">In Progress</span>
                            <span className="stat-value">{statistics.inProgressCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-item done">
                    <div className="stat-info">
                        <span className="stat-icon">✅</span>
                        <div className="stat-text">
                            <span className="stat-label">Completed</span>
                            <span className="stat-value">{statistics.doneCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-item overdue">
                    <div className="stat-info">
                        <span className="stat-icon">⚠️</span>
                        <div className="stat-text">
                            <span className="stat-label">Overdue</span>
                            <span className="stat-value">{statistics.overdueCount || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="stat-item urgent">
                    <div className="stat-info">
                        <span className="stat-icon">🚨</span>
                        <div className="stat-text">
                            <span className="stat-label">Urgent</span>
                            <span className="stat-value">{statistics.urgentCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskStatistics;