import { useEffect, useState } from "react";
import { getTasks } from "../services/api";

function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks().then(data => setTasks(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title} - {task.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
