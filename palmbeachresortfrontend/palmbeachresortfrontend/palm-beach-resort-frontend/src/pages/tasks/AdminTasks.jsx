import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TaskCard from '../../components/tasks/TaskCard';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskStatistics from '../../components/tasks/TaskStatistics';
import taskService from '../../services/taskService';
import './AdminTasks.css';

const AdminTasks = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        assignedTo: '',
        assignedToId: '',
        dueDate: '',
        sortBy: 'createdAt'
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, filters, searchTerm]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            console.log('Loading tasks from database...');
            const tasksData = await taskService.getAllTasks();
            console.log('Tasks loaded from database:', tasksData);
            setTasks(tasksData || []);
        } catch (error) {
            console.error('Error loading tasks from database:', error);
            alert('Failed to load tasks from database');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        // Apply priority filter
        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }

        // Apply assigned filter
        if (filters.assignedTo === 'unassigned') {
            filtered = filtered.filter(task => !task.assignedTo);
        } else if (filters.assignedTo === 'assigned') {
            filtered = filtered.filter(task => task.assignedTo);
        }

        // Apply staff member filter
        if (filters.assignedToId) {
            filtered = filtered.filter(task => task.assignedTo == filters.assignedToId);
        }

        // Apply due date filter
        if (filters.dueDate) {
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            switch (filters.dueDate) {
                case 'today':
                    filtered = filtered.filter(task => task.dueDate === today);
                    break;
                case 'tomorrow':
                    filtered = filtered.filter(task => task.dueDate === tomorrowStr);
                    break;
                case 'overdue':
                    filtered = filtered.filter(task => {
                        const dueDate = new Date(task.dueDate);
                        const today = new Date();
                        return dueDate < today && task.status !== 'DONE' && task.status !== 'CANCELLED';
                    });
                    break;
                case 'future':
                    filtered = filtered.filter(task => new Date(task.dueDate) > new Date());
                    break;
                default:
                    break;
            }
        }

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title?.toLowerCase().includes(searchLower) ||
                task.description?.toLowerCase().includes(searchLower) ||
                task.assignedToName?.toLowerCase().includes(searchLower) ||
                task.createdByName?.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        if (filters.sortBy) {
            filtered.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'dueDate':
                        return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
                    case 'priority':
                        const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                        return priorityOrder[a.priority] - priorityOrder[b.priority];
                    case 'title':
                        return (a.title || '').localeCompare(b.title || '');
                    case 'status':
                        return (a.status || '').localeCompare(b.status || '');
                    case 'createdAt':
                    default:
                        return new Date(b.createdAt) - new Date(a.createdAt);
                }
            });
        }

        setFilteredTasks(filtered);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            assignedTo: '',
            assignedToId: '',
            dueDate: '',
            sortBy: 'createdAt'
        });
        setSearchTerm('');
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            console.log('Updating task status in database:', taskId, newStatus);
            await taskService.updateTaskStatus(taskId, { status: newStatus });
            await loadTasks(); // Reload tasks to get updated data from database
        } catch (error) {
            console.error('Error updating task status in database:', error);
            alert('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task from the database?')) {
            try {
                await taskService.deleteTask(taskId);
                await loadTasks(); // Reload tasks after deletion from database
            } catch (error) {
                console.error('Error deleting task from database:', error);
                alert('Failed to delete task from database');
            }
        }
    };

    const handleCreateTask = () => {
        navigate('/admin/tasks/create');
    };

    if (loading) {
        return (
            <div className="admin-tasks">
                <div className="loading-section">
                    <div className="loading-spinner"></div>
                    <p>Loading tasks from database...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-tasks">
            <div className="tasks-header">
                <div>
                    <h1 className="tasks-title">Task Management</h1>
                    <p className="tasks-subtitle">Manage and assign tasks to staff members</p>
                </div>
                <button className="create-task-btn" onClick={handleCreateTask}>
                    <span>+</span>
                    Create Task
                </button>
            </div>

            <div className="tasks-actions">
                <div className="search-box">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tasks by title, description, or assignee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="search-icon">🔍</span>
                </div>
                <button className="refresh-btn" onClick={loadTasks}>
                    Refresh
                </button>
            </div>

            <div className="tasks-content">
                <div className="tasks-list">
                    <TaskFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    {filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3 className="empty-title">No tasks found</h3>
                            <p className="empty-description">
                                {tasks.length === 0
                                    ? "No tasks found in the database. Create your first task to get started."
                                    : "No tasks match your current filters. Try adjusting your search criteria."
                                }
                            </p>
                            {tasks.length === 0 && (
                                <button className="create-task-btn" onClick={handleCreateTask}>
                                    Create Your First Task
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="tasks-grid">
                            {filteredTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onStatusUpdate={handleStatusUpdate}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="tasks-sidebar">
                    <TaskStatistics />
                </div>
            </div>
        </div>
    );
};

export default AdminTasks;