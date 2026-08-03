import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // Add Task
  // -------------------------
  const addTask = async () => {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setStatus("todo");

        await fetchTasks();
      } else {
        alert("Failed to add task.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // Load task into form
  // -------------------------
  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  // -------------------------
  // Update Task
  // -------------------------
  const updateTask = async () => {
    try {
      const response = await fetch(`${API_URL}${editingId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
        }),
      });

      if (response.ok) {
        setEditingId(null);

        setTitle("");
        setDescription("");
        setStatus("todo");

        await fetchTasks();
      } else {
        alert("Failed to update task.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------------
  // Cancel Editing
  // -------------------------
  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("todo");
  };

  // -------------------------
  // Delete Task
  // -------------------------
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTasks();
      } else {
        alert("Failed to delete task.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "30px auto" }}>
      <div
  style={{
    backgroundColor: "#0d6efd",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "25px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  }}
>
  <h1 style={{ margin: 0 }}>TaskSphere Dashboard</h1>
  </div>

     <div
  style={{
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solid #e5e5e5",
  }}
>
       <h3
  style={{
    margin: 0,
    marginBottom: "25px",
    color: "#0d6efd",
    fontSize: "26px",
    fontWeight: "600",
    borderBottom: "2px solid #e9ecef",
    paddingBottom: "15px",
  }}
>
  {editingId ? "Edit Task" : "Create Task"}
</h3>

        <input
  type="text"
  placeholder="Task Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  style={inputStyle}
/>

        <textarea
  placeholder="Task Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  style={{
    ...inputStyle,
    height: "80px",
    resize: "none",
  }}
/>

       <select
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  style={inputStyle}
>
  <option value="" disabled style={{ color: "#6c757d" }}>
    Select Status
  </option>

  <option value="todo" style={{ color: "#000" }}>
    To Do
  </option>

  <option value="in_progress" style={{ color: "#000" }}>
    In Progress
  </option>

  <option value="completed" style={{ color: "#000" }}>
    Completed
  </option>
</select>

        {editingId ? (
          <><button
  onClick={updateTask}
  style={{
    backgroundColor: "#198754",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Update Task
</button>

            <button
              onClick={cancelEdit}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
  onClick={addTask}
  style={{
    backgroundColor: "#0d6efd",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  Add Task
</button>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Title</th>
            <th style={th}>Description</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td style={td}>{task.id}</td>

              <td style={td}>{task.title}</td>

              <td style={td}>{task.description}</td>

              <td style={td}>
                {task.status === "todo"
                  ? "To Do"
                  : task.status === "in_progress"
                  ? "In Progress"
                  : "Completed"}
              </td>

        <td style={td}>
  <div
    style={{
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <button
      onClick={() => editTask(task)}
      style={{
        backgroundColor: "#0d6efd",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Edit
    </button>

    <button
      onClick={() => deleteTask(task.id)}
      style={{
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Delete
    </button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  backgroundColor: "#0d6efd",
  color: "white",
  padding: "14px",
  textAlign: "left",
  border: "none",
};

const td = {
  border: "1px solid #ccc",
  padding: "10px",
  whiteSpace: "nowrap",
};
const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "12px 15px",
  marginBottom: "10px",
  border: "1px solid #ced4da",
  borderRadius: "8px",
  fontSize: "16px",
  boxSizing: "border-box",
};
export default Dashboard;