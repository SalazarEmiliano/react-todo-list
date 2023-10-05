import React, { useState } from 'react';
import './styles.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [taskStatus, setTaskStatus] = useState('New');
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [taskPriority, setTaskPriority] = useState('Low');
  const [taskDescription, setTaskDescription] = useState('');
  const [showDescription, setShowDescription] = useState({});
  const [showCompleted, setShowCompleted] = useState(true);

  // New state for description during editing
  const [editDescription, setEditDescription] = useState('');

  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: taskText,
        status: taskStatus,
        dueDate: taskDueDate,
        priority: taskPriority,
        description: taskDescription,
        completed: false,
      };

      setTasks([...tasks, newTask]);
      setTaskText('');
      setTaskStatus('New');
      setTaskDueDate(null);
      setTaskPriority('Low');
      setTaskDescription('');
      setShowDescription({ ...showDescription, [newTask.id]: false });
    }
  };

  const editTask = (id) => {
    setEditIndex(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditText(taskToEdit.text);
      setTaskStatus(taskToEdit.status);
      setTaskDueDate(taskToEdit.dueDate);
      setTaskPriority(taskToEdit.priority);
      setEditDescription(taskToEdit.description); // Use separate state for description during editing
    }
  };

  const updateTask = () => {
    if (editText.trim() !== '') {
      const updatedTasks = tasks.map((task) =>
        task.id === editIndex
          ? {
              ...task,
              text: editText,
              status: taskStatus,
              dueDate: taskDueDate,
              priority: taskPriority,
              description: editDescription, // Use separate state for description during editing
            }
          : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditText('');
      // Reset additional details
      setTaskStatus('New');
      setTaskDueDate(null);
      setTaskPriority('Low');
      setTaskDescription('');
    }
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    const deletedTask = tasks.find((task) => task.id === id);

    if (deletedTask && deletedTask.completed) {
      // If the deleted task was completed, remove it from completedTasks
      const updatedCompletedTasks = completedTasks.filter(
        (task) => task.id !== id
      );
      setCompletedTasks(updatedCompletedTasks);
    }

    setTasks(updatedTasks);

    const updatedShowDescription = { ...showDescription };
    delete updatedShowDescription[id];

    setEditIndex(null);
    setEditText('');
    // Reset additional details
    setTaskStatus('New');
    setTaskDueDate(null);
    setTaskPriority('Low');
    setTaskDescription('');
    setShowDescription(updatedShowDescription);
  };

  const toggleCompletion = (id) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      const completedTask = updatedTasks.find((task) => task.id === id);

      setCompletedTasks((prevCompletedTasks) => {
        if (completedTask && completedTask.completed) {
          // Add completed task to Completed List if not already present
          return prevCompletedTasks.some((task) => task.id === id)
            ? prevCompletedTasks
            : [...prevCompletedTasks, completedTask];
        } else {
          // Remove completed task from Completed List
          return prevCompletedTasks.filter((task) => task.id !== id);
        }
      });

      return updatedTasks;
    });

    setShowDescription((prevShowDescription) => ({
      ...prevShowDescription,
      [id]: !prevShowDescription[id],
    }));
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) {
      return false; // No due date, not overdue
    }
  
    const today = new Date();
    const due = new Date(dueDate);
  
    return due < today;
  };
  

  const renderTask = (task) => (
    <li key={task.id} className={`${task.completed ? 'completed' : ''} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
      {task ? (
        <>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleCompletion(task.id)}
          />

          {editIndex === task.id ? (
            <>
              <label>
                Task:
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </label>
              <label>
                Status:
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>
              <label>
                Priority:
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
              <label>
                Due Date:
                <input
                  type="date"
                  value={taskDueDate || ''}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Task description"
                />
              </label>
              <button onClick={updateTask}>Save</button>
            </>
          ) : (
            <>
              <strong>Task:</strong> {task.text}{' '}
              <strong>Status:</strong> {task.status}{' '}
              <strong>Priority:</strong> {task.priority}{' '}
              <strong>Due Date:</strong> {task.dueDate || 'Not set'}
              {showDescription[task.id] && (
                <>
                  <strong>Description:</strong> {task.description}
                </>
              )}
              <button
                onClick={() =>
                  setShowDescription({
                    ...showDescription,
                    [task.id]: !showDescription[task.id],
                  })
                }
              >
                {showDescription[task.id] ? 'Hide Description' : 'Show Description'}
              </button>
              <br />
              <button onClick={() => editTask(task.id)}>Edit</button>{' '}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </>
      ) : null}
    </li>
  );

  const hideTitle = showCompleted && completedTasks.length === 0;
  const todoTasks = tasks.filter((task) => !task.completed);
  const completedTasksList = tasks.filter((task) => task.completed);

  return (
    <div className="container">
      {!hideTitle && <h1>To-Do App</h1>}
      <div>
        <h2>Add a new task</h2>
        <label>
          Task:
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Task name"
          />
        </label>
        <label>
          Status:
          <select
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <label>
          Priority:
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <label>
          Due Date:
          <input
            type="date"
            value={taskDueDate || ''}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Task description"
          />
        </label>
        <button onClick={addTask}>Add</button>
        <button onClick={() => setShowCompleted(!showCompleted)}>
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>
      {tasks.length > 0 && (
        <div>
          <h2>To-Do List</h2>
          <ul>{todoTasks.map((task) => renderTask(task))}</ul>
        </div>
      )}
      {completedTasks.length > 0 && showCompleted && (
        <div>
          <h2>Completed tasks</h2>
          <ul>{completedTasksList.map((completed) => renderTask(completed))}</ul>
        </div>
      )}
    </div>
  );
}

export default TodoList;
