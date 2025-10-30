import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import taskService from '../../services/taskService';
import './TaskFilters.css';

const TaskFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const { user } = useAuth();
    const [availableStaff, setAvailableStaff] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load real staff data for assignment filtering (Admin only)
        if (user?.role === 'ADMIN') {
            loadStaffMembers();
        }
    }, [user?.role]);

    // REAL: Load actual staff members from backend for assignment filtering
    const loadStaffMembers = async () => {
        try {
            setLoading(true);
            // This should call your actual staff endpoint
            // For now, we'll use getAllTasks to extract staff information
            const tasks = await taskService.getAllTasks();

            // Extract unique staff members from tasks
            const staffMap = new Map();
            tasks.forEach(task => {
                if (task.assignedTo && task.assignedToName) {
                    if (!staffMap.has(task.assignedTo)) {
                        staffMap.set(task.assignedTo, {
                            id: task.assignedTo,
                            name: task.assignedToName
                        });
                    }
                }
            });

            const staffList = Array.from(staffMap.values());
            console.log('Real staff data extracted from tasks:', staffList);
            setAvailableStaff(staffList);
        } catch (error) {
            console.error('Error loading real staff data:', error);
            setAvailableStaff([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        onFilterChange({
            ...filters,
            [filterType]: value
        });
    };

    const handleQuickFilter = (filterType, value) => {
        const newFilters = {
            status: filterType === 'status' ? value : '',
            priority: filterType === 'priority' ? value : '',
            assignedTo: filterType === 'assigned' ? value : '',
            assignedToId: filterType === 'staff' ? value : ''
        };
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        onClearFilters();
    };

    const hasActiveFilters = filters.status || filters.priority || filters.assignedTo || filters.assignedToId;

    // REAL: Get status counts from actual data for quick filter badges
    const getStatusCounts = async () => {
        try {
            const allTasks = await taskService.getAllTasks();
            const counts = {
                TODO: allTasks.filter(task => task.status === 'TODO').length,
                IN_PROGRESS: allTasks.filter(task => task.status === 'IN_PROGRESS').length,
                DONE: allTasks.filter(task => task.status === 'DONE').length,
                URGENT: allTasks.filter(task => task.priority === 'URGENT').length,
                UNASSIGNED: allTasks.filter(task => !task.assignedTo).length
            };
            return counts;
        } catch (error) {
            console.error('Error getting status counts:', error);
            return { TODO: 0, IN_PROGRESS: 0, DONE: 0, URGENT: 0, UNASSIGNED: 0 };
        }
    };

    const [statusCounts, setStatusCounts] = useState({
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0,
        URGENT: 0,
        UNASSIGNED: 0
    });

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            getStatusCounts().then(counts => setStatusCounts(counts));
        }
    }, [user?.role]);

    return (
        <div className="task-filters">
            <div className="filter-header">
                <h3 className="filter-title">Filter Tasks</h3>
                {hasActiveFilters && (
                    <button className="btn-sm btn-outline" onClick={clearFilters}>
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Quick Filters with Real Counts */}
            <div className="quick-filters">
                <button
                    className={`quick-filter-btn ${filters.status === 'TODO' ? 'active' : ''}`}
                    onClick={() => handleQuickFilter('status', 'TODO')}
                >
                    To Do {statusCounts.TODO > 0 && <span className="filter-count">({statusCounts.TODO})</span>}
                </button>
                <button
                    className={`quick-filter-btn ${filters.status === 'IN_PROGRESS' ? 'active' : ''}`}
                    onClick={() => handleQuickFilter('status', 'IN_PROGRESS')}
                >
                    In Progress {statusCounts.IN_PROGRESS > 0 && <span className="filter-count">({statusCounts.IN_PROGRESS})</span>}
                </button>
                <button
                    className={`quick-filter-btn ${filters.status === 'DONE' ? 'active' : ''}`}
                    onClick={() => handleQuickFilter('status', 'DONE')}
                >
                    Completed {statusCounts.DONE > 0 && <span className="filter-count">({statusCounts.DONE})</span>}
                </button>
                <button
                    className={`quick-filter-btn ${filters.priority === 'URGENT' ? 'active' : ''}`}
                    onClick={() => handleQuickFilter('priority', 'URGENT')}
                >
                    Urgent {statusCounts.URGENT > 0 && <span className="filter-count">({statusCounts.URGENT})</span>}
                </button>
                <button
                    className={`quick-filter-btn ${filters.assignedTo === 'unassigned' ? 'active' : ''}`}
                    onClick={() => handleQuickFilter('assigned', 'unassigned')}
                >
                    Unassigned {statusCounts.UNASSIGNED > 0 && <span className="filter-count">({statusCounts.UNASSIGNED})</span>}
                </button>
            </div>

            {/* Advanced Filters */}
            <div className="filter-grid">
                {/* Status Filter */}
                <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <select
                        className="filter-select"
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Status ({statusCounts.TODO + statusCounts.IN_PROGRESS + statusCounts.DONE})</option>
                        <option value="TODO">To Do ({statusCounts.TODO})</option>
                        <option value="IN_PROGRESS">In Progress ({statusCounts.IN_PROGRESS})</option>
                        <option value="DONE">Completed ({statusCounts.DONE})</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div className="filter-group">
                    <label className="filter-label">Priority</label>
                    <select
                        className="filter-select"
                        value={filters.priority || ''}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent ({statusCounts.URGENT})</option>
                    </select>
                </div>

                {/* Assignment Filter */}
                <div className="filter-group">
                    <label className="filter-label">Assignment</label>
                    <select
                        className="filter-select"
                        value={filters.assignedTo || ''}
                        onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
                    >
                        <option value="">Everyone</option>
                        <option value="unassigned">Unassigned ({statusCounts.UNASSIGNED})</option>
                        <option value="assigned">Assigned</option>
                    </select>
                </div>

                {/* Staff Member Filter (Admin Only) */}
                {user?.role === 'ADMIN' && availableStaff.length > 0 && (
                    <div className="filter-group">
                        <label className="filter-label">Staff Member</label>
                        <select
                            className="filter-select"
                            value={filters.assignedToId || ''}
                            onChange={(e) => handleFilterChange('assignedToId', e.target.value)}
                        >
                            <option value="">All Staff</option>
                            {availableStaff.map(staff => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Due Date Filter */}
                <div className="filter-group">
                    <label className="filter-label">Due Date</label>
                    <select
                        className="filter-select"
                        value={filters.dueDate || ''}
                        onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                    >
                        <option value="">Any Date</option>
                        <option value="today">Due Today</option>
                        <option value="tomorrow">Due Tomorrow</option>
                        <option value="week">This Week</option>
                        <option value="overdue">Overdue</option>
                        <option value="future">Future</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div className="filter-group">
                    <label className="filter-label">Sort By</label>
                    <select
                        className="filter-select"
                        value={filters.sortBy || ''}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="createdAt">Newest First</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                        <option value="status">Status</option>
                    </select>
                </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <div className="active-filters-label">Active Filters:</div>
                    <div className="active-filter-tags">
                        {filters.status && (
                            <span className="filter-tag">
                Status: {filters.status.replace('_', ' ')}
                                <button onClick={() => handleFilterChange('status', '')}>×</button>
              </span>
                        )}
                        {filters.priority && (
                            <span className="filter-tag">
                Priority: {filters.priority.toLowerCase()}
                                <button onClick={() => handleFilterChange('priority', '')}>×</button>
              </span>
                        )}
                        {filters.assignedTo === 'unassigned' && (
                            <span className="filter-tag">
                Unassigned
                <button onClick={() => handleFilterChange('assignedTo', '')}>×</button>
              </span>
                        )}
                        {filters.assignedTo === 'assigned' && (
                            <span className="filter-tag">
                Assigned
                <button onClick={() => handleFilterChange('assignedTo', '')}>×</button>
              </span>
                        )}
                        {filters.assignedToId && (
                            <span className="filter-tag">
                Staff: {availableStaff.find(s => s.id == filters.assignedToId)?.name || filters.assignedToId}
                                <button onClick={() => handleFilterChange('assignedToId', '')}>×</button>
              </span>
                        )}
                        {filters.dueDate && (
                            <span className="filter-tag">
                Due: {filters.dueDate}
                                <button onClick={() => handleFilterChange('dueDate', '')}>×</button>
              </span>
                        )}
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="filters-loading">
                    <div className="loading-spinner-small"></div>
                    <span>Loading real filter data...</span>
                </div>
            )}
        </div>
    );
};

export default TaskFilters;