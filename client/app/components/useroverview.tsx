import { useState, useEffect } from "react";
import axios from "axios";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function UserView({ name, user_id }: { name: string, user_id: number }) {
    const [task1Checked, setTask1Checked] = useState(false);
    const [tasks, setTasks] = useState<Array<any>>([]);

    useEffect(() => {
        axios.get(`${HOST}/api/tasks`, {
            withCredentials: true,
            params: { user_id }
        }).then((response: any) => {
            setTasks(response.data)
        }).catch((error: any) => {
            console.error("Error fetchting users:", error);
        })
    }, []);

    return (
        <div className="container">
            <h1>Welcome {name}</h1>
            {tasks.map((task, index) => (
                <div key={index} className="card">
                    <h2>{task.task}</h2><br />
                    {task.description} <br /><br />
                    {/* TODO: Make this functional / make logout functionality */}
                    Is this correct?: <input type="checkbox" checked={task1Checked} onChange={(e) => setTask1Checked(e.target.checked)} required />
                </div>
            ))}
        </div>
    )
}