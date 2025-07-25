import { useState } from "react";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function OperatorView({ name }: { name: string }) {

    //States
    const [task, setTask] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    /**
     * Handle selectbox
     * @param event target event
     */
    const handleChange = (event: any) => {
        setSelectedUser(event.target.value);
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

        //Save new user to the backend
        const res = await fetch(`${HOST}/addtask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, description, selectedUser }),
        });

        if (res.ok) {
            console.log('Task created!');
        } else {
            console.log('Error creating task');
            console.log("An unexpected error occurred. Please try again.");
        }

    }

    return (
        <div id="login-form">
            <h1>Welcome {name}</h1>
            <h2>Create task</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="task">Task* {errors.task && <span className="color-red">{errors.task}</span>}:</label>
                <input className={errors.task ? "error" : ""} type="text" id="task" name="task" value={task} onChange={e => setTask(e.target.value)} required />
                <label htmlFor="description">Description* {errors.description && <span className="color-red">{errors.description}</span>}:</label>
                <input className={errors.description ? "error" : ""} type="text" id="description" name="description" value={description} onChange={e => setDescription(e.target.value)} required />
                <label htmlFor="user">User*</label>
                <select name="user" id="user" value={selectedUser} onChange={handleChange}>
                    {/* TODO: Fetch user data from DB */}
                    <option value="driver">Driver</option>
                </select>
                <br />
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}