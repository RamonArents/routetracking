import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function OperatorView({ name }: { name: string }) {

    //States
    const [task, setTask] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [users, setUsers] = useState<Array<any>>([]);
    const [user_id, setUser_id] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    /**
     * Validates the form data
     * @returns errors in case of errors
     */
    function validate() {
        const errs: { [key: string]: string } = {};

        if (!task.trim()) errs.task = "Task is required";
        if (!description.trim()) errs.description = "Description is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    useEffect(() => {
        axios.get(`${HOST}/api/users`, {
            withCredentials: true
        }).then((response: any) => {
            setUsers(response.data)
        }).catch((error: any) => {
            console.error("Error fetchting users:", error);
        })
    }, []);
    
    /* User first value of selectbox as default */
    useEffect(() => {
        if(users.length > 0 && !user_id){
            setUser_id(users[0].id);
        }
    }, [users, user_id]);

    /**
     * Handle selectbox
     * @param event target event
     */
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUser_id(event.target.value);
    }

    /**
     * Handles the create account form
     * @param e prevent default
     * @returns to homepage if account was successfully created, otherwise an error
     */
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        //Invalid form data
        if (!validate()) return;

        console.log(user_id);

        //Save new user to the backend
        const res = await fetch(`${HOST}/addtask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, description, user_id, name }),
        });

        if (res.ok) {
            console.log('Task created!');
            setSuccessMessage("Task successfully created.");
        } else {
            console.log('Error creating task');
            console.log("An unexpected error occurred. Please try again.");
            setErrorMessage("Something went wrong creating the task.")
        }

    }

    /**
     * Logout user
     */
    const logout = async () => {
        const response = await fetch(`${HOST}/api/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (response.status === 200 || response.status === 201) {
            navigate("/");
        } else {
            console.error("There was an error");
        }

    }

    return (
        <div className="container">
            <h1>Welcome {name}</h1>
            <button onClick={logout} className="logout-button">Logout</button>
            <div id="login-form">
                {successMessage && (<div className="feedback-message success-message">{successMessage}</div>)}
                {errorMessage && (<div className="feedback-message error-message">{errorMessage}</div>)}

                <h2>Create task</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="task">Task* {errors.task && <span className="color-red">{errors.task}</span>}:</label>
                    <input className={errors.task ? "error" : ""} type="text" id="task" name="task" value={task} onChange={e => setTask(e.target.value)} required />
                    <label htmlFor="description">Description* {errors.description && <span className="color-red">{errors.description}</span>}:</label>
                    <textarea className={errors.description ? "error" : ""} id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                    <label htmlFor="user">User*</label>
                    <select name="user" id="user" value={user_id} onChange={handleChange}>
                        {users.map((user: any) => (
                            <option key={user.id} value={user.id}>{user.email}</option>
                        ))}
                    </select>
                    <br />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}