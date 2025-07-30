import { useState, useEffect } from "react";
import axios from "axios";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function UserView({ name, user_id }: { name: string, user_id: number }) {
    const [taskChecked, setTaskChecked] = useState(false);
    const [tasks, setTasks] = useState<Array<any>>([]);

    //Get tasks for user
    useEffect(() => {
        axios.get(`${HOST}/api/tasks`, {
            withCredentials: true,
            params: { user_id }
        }).then((response: any) => {
            setTasks(response.data)
        }).catch((error: any) => {
            console.error("Error fetchting tasks:", error);
        })
    }, []);

    // Update when tasks are done
    useEffect(() => {
        axios.put(`${HOST}/api/taskupdate`, {
            done: taskChecked ? 1 : 0,
            user_id
        }, {
            withCredentials: true
        }).then((response: any) => {
            console.log(response.data);
        }).catch((error: any) => {
            console.error("Error updating tasks:", error);
        })
    }, [taskChecked]); // Only run when taskChecked changes

    return (
        <div className="container">
            <h1>Welcome {name}</h1>
            {tasks.map((task, index) => (
                <div key={index} className="card">
                    <h2>{task.task}</h2><br />
                    {task.description} <br /><br />
                    {/* TODO: make logout functionality */}
                    {/* TODO: refactor so it can work with more tasks */}
                    Done?: <input type="checkbox" checked={taskChecked} onChange={(e) => setTaskChecked(e.target.checked)} required />
                </div>
            ))}
        </div>
    )
}