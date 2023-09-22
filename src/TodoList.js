// src/TodoList.js
import React, { useState } from 'react';
import './styles.css'; // Import the CSS file


function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    if (taskText.trim() !== '') {
      setTasks([...tasks, taskText]);
      setTaskText('');
    }
  };

  const editTask = (index) => {
    setEditIndex(index);
    setEditText(tasks[index]);
  };

  const updateTask = () => {
    if (editText.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = editText;
      setTasks(updatedTasks);
      setEditIndex(null);
      setEditText('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText('');
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={updateTask}>Save</button>
              </>
            ) : (
              <>
                {task}{' '}
                <button onClick={() => editTask(index)}>Edit</button>{' '}
                <button onClick={() => deleteTask(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
