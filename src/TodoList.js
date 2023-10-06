// src/components/TodoList.js

import React, { useState } from 'react';
import './styles.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [addState, setAddState] = useState({
    status: 'New',
    priority: 'Low',
    dueDate: null,
    description: '',
  });
  const [editState, setEditState] = useState({
    index: null,
    text: '',
    status: 'New',
    priority: 'Low',
    dueDate: null,
    description: '',
  });
  const [showDescription, setShowDescription] = useState({});
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleCompletion = (id, completed) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed, status: completed ? 'Completed' : 'New' } : task
      )
    );

    setEditState((prevEditState) =>
      prevEditState.index === id
        ? {
            ...prevEditState,
            completed,
            status: completed ? 'Completed' : 'New',
          }
        : prevEditState
    );

    setShowDescription((prevShowDescription) => ({
      ...prevShowDescription,
      [id]: !prevShowDescription[id],
    }));
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setEditState({
      index: null,
      text: '',
      status: 'New',
      priority: 'Low',
      dueDate: null,
      description: '',
    });
    setShowDescription((prevShowDescription) => {
      const updatedShowDescription = { ...prevShowDescription };
      delete updatedShowDescription[id];
      return updatedShowDescription;
    });
  };

  const addTask = () => {
    if (taskText.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: taskText,
        status: addState.status,
        dueDate: addState.dueDate,
        priority: addState.priority,
        description: addState.description,
        completed: addState.status === 'Completed',
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);

      setTaskText('');
      setAddState({
        status: 'New',
        priority: 'Low',
        dueDate: null,
        description: '',
      });
      setShowDescription({ ...showDescription, [newTask.id]: false });
    }
  };

  const editTask = (id) => {
    setEditState((prevEditState) => {
      const taskToEdit = tasks.find((task) => task.id === id);
      if (taskToEdit) {
        return {
          ...prevEditState,
          index: id,
          text: taskToEdit.text,
          status: taskToEdit.status,
          dueDate: taskToEdit.dueDate,
          priority: taskToEdit.priority,
          description: taskToEdit.description,
        };
      }
      return prevEditState;
    });
  };

  const updateTask = () => {
    if (editState.text.trim() !== '') {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editState.index
            ? {
                ...task,
                text: editState.text,
                status: editState.status,
                dueDate: editState.dueDate,
                priority: editState.priority,
                description: editState.description,
                completed: editState.status === 'Completed',
              }
            : task
        )
      );

      setEditState({
        index: null,
        text: '',
        status: 'New',
        priority: 'Low',
        dueDate: null,
        description: '',
      });
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) {
      return false;
    }

    const today = new Date();
    const due = new Date(dueDate);

    return due < today;
  };

  const renderTask = (task) => (
    <li
      key={task.id}
      className={`${
        task.completed ? 'completed' : ''
      } ${isOverdue(task.dueDate) ? 'overdue' : ''} ${
        task.status === 'Cancelled' ? 'cancelled' : ''
      } ${task.status === 'In Progress' ? 'in-progress' : ''} ${task.status === 'New' ? 'new' : ''}`}
    >
      <input
        type="checkbox"
        checked={editState.index === task.id ? editState.completed : task.completed}
        onChange={() => toggleCompletion(task.id, !task.completed)}
      />

      {editState.index === task.id ? (
        <>
          <label>
            Task:
            <input
              type="text"
              value={editState.text}
              onChange={(e) =>
                setEditState((prevState) => ({
                  ...prevState,
                  text: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Status:
            <select
              value={editState.status}
              onChange={(e) =>
                setEditState((prevState) => ({
                  ...prevState,
                  status: e.target.value,
                }))
              }
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
              value={editState.priority}
              onChange={(e) =>
                setEditState((prevState) => ({
                  ...prevState,
                  priority: e.target.value,
                }))
              }
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
              value={editState.dueDate || ''}
              onChange={(e) =>
                setEditState((prevState) => ({
                  ...prevState,
                  dueDate: e.target.value,
                }))
              }
            />
          </label>
          <label>
            Description:
            <textarea
              value={editState.description}
              onChange={(e) =>
                setEditState((prevState) => ({
                  ...prevState,
                  description: e.target.value,
                }))
              }
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
              <strong>Description:</strong>
              <div className="description-text">{task.description}</div>
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
            {showDescription[task.id]
              ? 'Hide Description'
              : 'Show Description'}
          </button>
          <br />
          <button onClick={() => editTask(task.id)}>Edit</button>{' '}
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </>
      )}
    </li>
  );

  const hideTitle =
    showCompleted && tasks.filter((task) => task.completed).length === 0;
  const todoTasks = tasks.filter(
    (task) => task.status === 'New' && !task.completed
  );
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'In Progress' && !task.completed
  );
  const completedTasksList = tasks.filter(
    (task) => task.status === 'Completed'
  );

  return (
    <div className="container">
      {hideTitle && <h1>To-Do App</h1>}
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
            value={addState.status}
            onChange={(e) =>
              setAddState((prevState) => ({
                ...prevState,
                status: e.target.value,
              }))
            }
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
            value={addState.priority}
            onChange={(e) =>
              setAddState((prevState) => ({
                ...prevState,
                priority: e.target.value,
              }))
            }
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
            value={addState.dueDate || ''}
            onChange={(e) =>
              setAddState((prevState) => ({
                ...prevState,
                dueDate: e.target.value,
              }))
            }
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={addState.description}
            onChange={(e) =>
              setAddState((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            placeholder="Task description"
          />
        </label>
        <button onClick={addTask}>Add</button>
        <button onClick={() => setShowCompleted(!showCompleted)}>
          {showCompleted ? 'Hide Completed' : 'Show Completed'}
        </button>
      </div>
      {todoTasks.length > 0 && (
        <div>
          <h2>To-Do List</h2>
          <ul>{todoTasks.map((task) => renderTask(task))}</ul>
        </div>
      )}
      {inProgressTasks.length > 0 && (
        <div>
          <h2>In Progress tasks</h2>
          <ul>{inProgressTasks.map((inProgress) => renderTask(inProgress))}</ul>
        </div>
      )}
      {showCompleted && completedTasksList.length > 0 && (
        <div>
          <h2>Completed tasks</h2>
          <ul>{completedTasksList.map((completed) => renderTask(completed))}</ul>
        </div>
      )}
      {/* Display Cancelled tasks */}
      {tasks.filter((task) => task.status === 'Cancelled').length > 0 && (
        <div>
          <h2>Cancelled tasks</h2>
          <ul>{tasks.filter((task) => task.status === 'Cancelled').map((cancelled) => renderTask(cancelled))}</ul>
        </div>
      )}
    </div>
  );
}

export default TodoList;
