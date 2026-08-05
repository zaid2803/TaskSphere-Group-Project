import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/tasks/";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const [editingId, setEditingId] = useState(null);

// Search & Filter
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

// Loading
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchTasks();
}, []);

// ===============================
// Dashboard Statistics
// ===============================

const totalTasks = tasks.length;

const todoTasks = tasks.filter(
  (task) => task.status === "todo"
).length;

const inProgressTasks = tasks.filter(
  (task) => task.status === "in_progress"
).length;

const completedTasks = tasks.filter(
  (task) => task.status === "completed"
).length;

const completionRate =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

// ===============================
// Search & Filter Logic
// ===============================

const filteredTasks = useMemo(() => {
  return tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [tasks, searchTerm, statusFilter]);

const fetchTasks = async () => {
  try {
    setLoading(true);

    const response = await fetch(API_URL);
    const data = await response.json();

    setTasks(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
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
   
  <div
  style={{
    width: "100%",
    minHeight: "100vh",
    padding: "15px 25px",
    boxSizing: "border-box",
   background: "linear-gradient(135deg, #dbeafe, #f8fafc, #e0f2fe)",
    overflowY: "auto",
  }}
>
  <nav
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: "12px 25px",
    borderRadius: "15px",
    marginBottom: "15px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
  }}
>

  <h2
  style={{
    margin: 0,
    color: "#1E40AF",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  }}
>
  🚀 TaskSphere
</h2>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "20px",
  }}
>
  <button
    onClick={() => (window.location.href = "/")}
    style={{
      background: "transparent",
      color: "#334155",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      padding: "8px 12px",
    }}
  >
    🏠 Home
  </button>

  <button
    onClick={() => (window.location.href = "/dashboard")}
    style={{
      background: "transparent",
      color: "#2563EB",
      border: "none",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      padding: "5px 8px",
    }}
  >
    📋 Dashboard
  </button>

  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }}
    style={{
      backgroundColor: "#2563EB",
      color: "#fff",
      border: "none",
      padding: "7px 14px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
    }}
  >
    🚪 Logout
  </button>
</div>

</nav>
  <div
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
  padding: "18px 25px",
  marginBottom: "15px",
    border: "1px solid #E2E8F0",
    boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
  }}
>
  <h1
    style={{
      margin: 0,
      color: "#1E293B",
      fontSize: "22px",
      fontWeight: "700",
    }}
  >
    👋 Welcome Back!
  </h1>

  <p
    style={{
      marginTop: "10px",
      color: "#64748B",
      fontSize: "16px",
    }}
  >
    Manage your tasks efficiently and keep your work organized.
  </p>
</div>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <div
  style={{
    ...cardStyle,
    borderTop: "6px solid #2563EB",
  }}
>
  <h4 style={{ color: "#6B7280", marginBottom: "10px" }}>
    📋 Total Tasks
  </h4>

  <h1
    style={{
      color: "#2563EB",
      margin: 0,
      fontSize: "32px",
    }}
  >
    {totalTasks}
  </h1>
</div>

 <div
  style={{
    ...cardStyle,
    borderTop: "6px solid #F59E0B",
  }}
>
  <h4 style={{ color: "#6B7280", marginBottom: "10px" }}>
    🟡 To Do
  </h4>

  <h1
    style={{
      color: "#F59E0B",
      margin: 0,
      fontSize: "32px",
    }}
  >
    {todoTasks}
  </h1>
</div>
  <div
  style={{
    ...cardStyle,
    borderTop: "6px solid #8B5CF6",
  }}
>
  <h4 style={{ color: "#6B7280", marginBottom: "10px" }}>
    🔄 In Progress
  </h4>

  <h1
    style={{
      color: "#8B5CF6",
      margin: 0,
      fontSize: "32px",
    }}
  >
    {inProgressTasks}
  </h1>
</div>

  <div
  style={{
    ...cardStyle,
    borderTop: "6px solid #22C55E",
  }}
>
  <h4 style={{ color: "#6B7280", marginBottom: "10px" }}>
    ✅ Completed
  </h4>

  <h1
    style={{
      color: "#22C55E",
      margin: 0,
      fontSize: "32px",
    }}
  >
    {completedTasks}
  </h1>
</div>
</div>
     <div
  style={{
    backgroundColor: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solid #e5e5e5",
  }}
>
       <h3
  style={{
    margin: 0,
    marginBottom: "12px",
    color: "#0d6efd",
    fontSize: "22px",
    fontWeight: "600",
    borderBottom: "2px solid #e9ecef",
    paddingBottom: "8px",
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
  rows={2}
  style={{
    ...inputStyle,
    height: "55px",
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
    padding: "8px 16px",
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
    <div
  style={{
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "250px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  }}
></div>
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
        <footer
  style={{
    marginTop: "9px",
    background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
    color: "white",
    padding: "6px",
    textAlign: "center",
    borderRadius: "10px",
    fontSize: "10px",
  }}
>
        © 2026 TaskSphere | Smart Task Management System
      </footer>
    </div>
    


  );
}

const th = {
  backgroundColor: "#0d6efd",
  color: "white",
  padding: "8px 10px",
  textAlign: "left",
  border: "none",
  fontSize: "14px",
};

const td = {
  border: "1px solid #e5e7eb",
  padding: "6px 10px",
  whiteSpace: "nowrap",
  fontSize: "14px",
};
const inputStyle = {
  width: "100%",
  height: "38px",
  padding: "8px 12px",
  marginBottom: "8px",
  border: "1px solid #ced4da",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
};
const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "12px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  border: "1px solid #e5e5e5",
};

export default Dashboard;