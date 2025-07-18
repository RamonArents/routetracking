import { useState } from "react";

export function UserView({ name }: { name: string }) {
    const [task1Checked, setTask1Checked] = useState(false);
    const [task2Checked, setTask2Checked] = useState(false);

    return (
        <div className="container">
            <h1>Welcome {name}</h1>
            {/* TODO: This data needs to come from DB and in an loop. */}
            <div className="card">
                <h2>Task 1: Check your load:</h2><br />
                Items: Chairs.<br />
                Count: 100.<br />
                Is this correct?: <input type="checkbox" checked={task1Checked} onChange={(e) => setTask1Checked(e.target.checked)} required />
            </div>
            <hr className="card-line" />
            <div className={!task1Checked ? "vague" : "card"}>
                <h2>Task 2: Drive to the following address:</h2><br />
                Name: Concertgebouw.<br />
                Address: Museumplein 1.<br />
                Postal code: 1234 XX.<br />
                City: Amsterdam.<br />
                Is this correct?: <input type="checkbox" checked={task2Checked} disabled={!task1Checked} onChange={(e) => setTask2Checked(e.target.checked)}  required />
            </div>
            <hr className="card-line" />
            <div className={!task2Checked ? "vague" : "card "}>
                <h2>Task 3: Deliver and sign:</h2><br />
                Sign: Yes.<br />
                Deliver location: Loading bay 3.<br />
                Is this correct?: <input type="checkbox" disabled={!task2Checked} required />
            </div>
        </div>
    )
}