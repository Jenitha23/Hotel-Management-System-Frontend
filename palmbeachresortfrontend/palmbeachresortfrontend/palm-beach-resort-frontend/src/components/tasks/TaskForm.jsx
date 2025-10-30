import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import taskService from '../../services/taskService';
import './TaskForm.css';

const TaskForm = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [staffMembers, setStaffMembers] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedTo: '',
        assignedToName: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadStaffMembers();
        if (taskId) {
            loadTask();
        }
    }, [taskId]);

    useEffect(() => {
        // Filter staff members based on search term
        const filtered = staffMembers.filter(staff =>
            staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.position && staff.position.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredStaff(filtered);
    }, [searchTerm, staffMembers]);

    const loadStaffMembers = async () => {
        try {
            const staffData = await taskService.getAllStaff();
            setStaffMembers(staffData);
            setFilteredStaff(staffData);
        } catch (error) {
            console.error('Error loading staff members:', error);
            setStaffMembers([]);
            setFilteredStaff([]);
        }
    };

    const loadTask = async () => {
        try {
            const taskData = await taskService.getTaskById(taskId);
            setFormData({
                title: taskData.title || '',
                description: taskData.description || '',
                priority: taskData.priority || 'MEDIUM',
                dueDate: taskData.dueDate || '',
                assignedTo: taskData.assignedTo || '',
                assignedToName: taskData.assignedToName || ''
            });

            // Set search term to the assigned staff name if exists
            if (taskData.assignedToName && taskData.assignedToName !== 'Unassigned') {
                setSearchTerm(taskData.assignedToName);
            }
        } catch (error) {
            console.error('Error loading task:', error);
            alert('Failed to load task');
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowStaffDropdown(true);

        // Clear assignment if search term is empty
        if (!value.trim()) {
            setFormData(prev => ({
                ...prev,
                assignedTo: '',
                assignedToName: ''
            }));
        }
    };

    const handleStaffSelect = (staff) => {
        setFormData(prev => ({
            ...prev,
            assignedTo: staff.id,
            assignedToName: staff.fullName
        }));
        setSearchTerm(staff.fullName);
        setShowStaffDropdown(false);
    };

    const handleClearAssignment = () => {
        setFormData(prev => ({
            ...prev,
            assignedTo: '',
            assignedToName: ''
        }));
        setSearchTerm('');
        setShowStaffDropdown(false);
    };

    const handleInputFocus = () => {
        setShowStaffDropdown(true);
    };

    const handleInputBlur = () => {
        // Delay hiding dropdown to allow for click selection
        setTimeout(() => {
            setShowStaffDropdown(false);
        }, 200);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const submitData = {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                dueDate: formData.dueDate,
                assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null
            };

            console.log('Submitting task data to backend:', submitData);

            if (taskId) {
                await taskService.updateTask(taskId, submitData);
                alert('Task updated successfully!');
            } else {
                await taskService.createTask(submitData);
                alert('Task created successfully!');
            }

            navigate('/admin/tasks');
        } catch (error) {
            console.error('Error saving task:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to ${taskId ? 'update' : 'create'} task: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/tasks');
    };

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    return (
        <div className="task-form-container">
            <div className="form-header">
                <h1>{taskId ? 'Edit Task' : 'Create New Task'}</h1>
                <p>{taskId ? 'Update task details' : 'Create a new task for staff members'}</p>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="title">
                        Task Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-input"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter task title"
                    />
                    {errors.title && <div className="error-message">{errors.title}</div>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-textarea"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter task description (optional)"
                        rows="4"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="priority">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            className="form-select"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="dueDate">
                            Due Date *
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            className="form-input"
                            value={formData.dueDate}
                            onChange={handleChange}
                            min={getTomorrowDate()}
                        />
                        {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="assignedTo">
                        Assign To
                    </label>
                    <div className="searchable-dropdown">
                        <div className="search-input-container">
                            <input
                                type="text"
                                className="form-input"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                placeholder="Type to search staff members..."
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    className="clear-button"
                                    onClick={handleClearAssignment}
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {showStaffDropdown && filteredStaff.length > 0 && (
                            <div className="dropdown-menu">
                                {filteredStaff.map(staff => (
                                    <div
                                        key={staff.id}
                                        className="dropdown-item"
                                        onClick={() => handleStaffSelect(staff)}
                                    >
                                        <div className="staff-name">{staff.fullName}</div>
                                        <div className="staff-details">
                                            {staff.email} {staff.position && `• ${staff.position}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showStaffDropdown && filteredStaff.length === 0 && searchTerm && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item no-results">
                                    No staff members found
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="form-help">
                        {staffMembers.length === 0
                            ? 'Loading staff members...'
                            : 'Start typing to search staff members'
                        }
                    </div>
                    {formData.assignedToName && (
                        <div className="assignment-info">
                            Currently assigned to: <strong>{formData.assignedToName}</strong>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                {taskId ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            taskId ? 'Update Task' : 'Create Task'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;