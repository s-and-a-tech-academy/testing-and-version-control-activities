// App.jsx
import React, { useState } from 'react';

// Main App component
function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [buggyCounter, setBuggyCounter] = useState(0); // Intentional buggy total task counter
  const [completedTasksCount, setCompletedTasksCount] = useState(0); // BUG: Completed tasks counter
  const [draggedTaskId, setDraggedTaskId] = useState(null); // State for drag-and-drop

  // Bug 1: Adds empty tasks without validation (and no user feedback)
  // Bug 2: Buggy total task counter desynchronization and potential negative values
  const handleAddTask = () => {
    // BUG 2 (Part 1): Counter increments on every button click/Enter press, regardless of input content.
    setBuggyCounter(buggyCounter + 1);

    // BUG 1: No user feedback for empty input.
    // The task is ONLY added to the 'tasks' array if the input is not empty.
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    } else {
      console.log("Attempted to add empty task (no UI feedback).");
    }
  };

  // Bug 2 (Part 2): Deleting items causes total counter to go negative if desynced
  // Bug 6: Deleting the last item might have a visual delay for "No tasks" message
  const handleDeleteTask = (idToDelete) => {
    // BUG 6: Simulate a network delay for deleting.
    setTimeout(() => {
      const taskToDelete = tasks.find(task => task.id === idToDelete);
      setTasks(tasks.filter(task => task.id !== idToDelete));

      // BUG 2 (Part 2): Decrements the total counter.
      // If the total counter was inflated by previous empty task additions (from Bug 2 Part 1),
      // it can now go negative.
      setBuggyCounter(buggyCounter - 1);

      // BUG: If a completed task is deleted, the completedTasksCount should ideally decrement,
      // but the bug for completedTasksCount is that it only increments.
      // So, no change to completedTasksCount here, which is consistent with its specific bug.
    }, 100); // Small delay to make "No tasks" flicker or delay
  };

  // Bug 3: Toggling completion has no clear visual feedback (cursor)
  // New Bug: Completed task counter increments but doesn't decrement
  const handleToggleComplete = (idToToggle) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === idToToggle) {
          const newCompletedStatus = !task.completed;
          if (newCompletedStatus) { // Task is becoming completed
            setCompletedTasksCount(prevCount => prevCount + 1);
          }
          // BUG (Completed Counter): If newCompletedStatus is false (task is incomplete),
          // we intentionally do NOT decrement completedTasksCount here.
          return { ...task, completed: newCompletedStatus };
        }
        return task;
      });
    });
    // BUG 3: No visual feedback on click (e.g., cursor doesn't change to pointer),
    // making it less intuitive that the task text is clickable.
  };

  // New Bug: Drag to reorder feature that doesn't put the task where the user tries to place it
  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id); // Store ID for drop
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) {
      return;
    }

    const draggedTask = tasks.find(task => task.id === draggedTaskId);
    if (!draggedTask) return;

    // Remove the dragged task from its original position
    const filteredTasks = tasks.filter(task => task.id !== draggedTaskId);

    // BUG (Drag Reorder): Instead of inserting at the target position,
    // insert at a random index in the array.
    const randomIndex = Math.floor(Math.random() * (filteredTasks.length + 1));
    const newTasks = [
      ...filteredTasks.slice(0, randomIndex),
      draggedTask,
      ...filteredTasks.slice(randomIndex)
    ];

    setTasks(newTasks);
    setDraggedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* New Bug: Cursor shows clickable icon on non-clickable title */}
        <h1
          className="text-3xl font-extrabold text-gray-800 text-center mb-6"
          style={{ cursor: 'pointer' }}
        >
          Buggy Task Manager
        </h1>

        {/* New Bug: Button and text field misaligned + Inverted cursor behavior */}
        <div className="flex mb-6 space-x-3 items-start"> {/* Use items-start for misalignment */}
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            // BUG 4: Fixed width on the input can cause misalignment or responsiveness issues
            style={{ width: 'calc(100% - 100px)', cursor: 'default' }} // New Bug: Inverted cursor
            placeholder="Add a new buggy task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTask();
              }
            }}
            tabIndex="1" // New Bug: Custom tab order (input first)
          />
          {/* BUG 5: Accessibility: `focus:outline-none` removes the default browser focus ring.
              New Bug: Misalignment (mt-2) + Inverted cursor behavior + Custom tab order */}
          <button
            onClick={handleAddTask}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mt-2" // New Bug: mt-2 for misalignment
            style={{ cursor: 'default' }} // New Bug: Inverted cursor
            tabIndex="3" // New Bug: Custom tab order (button after tasks)
          >
            Add Task
          </button>
        </div>

        {/* Bug 6: Conditional rendering for "No tasks" might be buggy due to delay */}
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No tasks yet! Add some to find bugs.</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg shadow-sm border ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-200'
                }`}
                draggable="true" // Enable dragging
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, task.id)}
              >
                {/* BUG 3: No cursor change on hover, making it less intuitive that it's clickable
                    New Bug: Inverted cursor behavior + Custom tab order */}
                <span
                  onClick={() => handleToggleComplete(task.id)}
                  className={`flex-grow text-lg ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                  style={{ userSelect: 'none', cursor: 'default' }} // New Bug: Inverted cursor
                  tabIndex="2" // New Bug: Custom tab order (tasks after input)
                >
                  {task.text}
                </span>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="ml-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  style={{ cursor: 'default' }} // New Bug: Inverted cursor
                  tabIndex="4" // New Bug: Custom tab order (delete buttons last)
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Buggy counter display */}
        <p className="text-right text-sm text-gray-600 mt-4">
          Total tasks (buggy counter): {buggyCounter}
        </p>
        {/* New Bug: Completed tasks counter */}
        <p className="text-right text-sm text-gray-600">
          Completed tasks (buggy counter): {completedTasksCount}
        </p>
      </div>
    </div>
  );
}

export default App;
