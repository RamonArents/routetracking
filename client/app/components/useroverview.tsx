import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function UserView({ name, user_id }: { name: string, user_id: number }) {
    const [taskStates, setTaskStates] = useState<{ [taskId: number]: boolean }>({});
    const [tasks, setTasks] = useState<Array<any>>([]);

    const navigate = useNavigate();

    //Get tasks for user
    useEffect(() => {
        axios.get(`${HOST}/api/tasks`, {
            withCredentials: true,
            params: { user_id }
        }).then((response: any) => {
            const ordered = response.data.sort((a:any, b:any) => a.id - b.id);
            
            setTasks(ordered);

            const initialStates: { [taskId: number]: boolean } = {};
            response.data.forEach((task: any) => {
                initialStates[task.id] = task.done === 1;
            });

            setTaskStates(initialStates);

        }).catch((error: any) => {
            console.error("Error fetchting tasks:", error);
        })
    }, []);

    /**
     * Logout user
     */
    const logout = async () => {
        const response = await fetch(`${HOST}/api/logout`, {
            method: "POST",
            credentials: "include",
        });

        if(response.status === 200 || response.status === 201){
            navigate("/");
        } else {
            console.error("There was an error");
        }

    }

    return (
        <div className="container">
            <h1>Welcome {name}</h1>
            <button onClick={logout} className="logout-button">Logout</button>
            {tasks.map((task) => (
                <React.Fragment key={task.id}>
                    <div className="card">
                        <h2>{task.task}</h2><br />
                        {task.description} <br /><br />
                        Done?: <input type="checkbox" checked={!!taskStates[task.id]} onChange={(e) => {
                            //Update tasks individually
                            const checked = e.target.checked;
                            setTaskStates(prev => ({ ...prev, [task.id]: checked }));

                            axios.put(`${HOST}/api/taskupdate`, {
                                done: checked ? 1 : 0,
                                task_id: task.id,
                                user_id,
                            }, {
                                withCredentials: true
                            }).catch((error: any) => {
                                console.error("Error updating tasks:", error);
                            })
                        }} />
                    </div>
                    <hr className="card-line" />
                </React.Fragment>
            ))}
        </div>
    )
}