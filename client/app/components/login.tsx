import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'

export function Login(){
    //feedback from createaccount
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
      if (location.state?.successMessage) {
        setSuccessMessage(location.state.successMessage);
        //Clear message after refresh
        window.history.replaceState({}, document.title);
      }
    }, [location.state]);

    return (  
    <div id="login-form">
      {successMessage && (<div className="success-message">{successMessage}</div>)}
      <h1>Login</h1>
      <form>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <span>No account? <Link to="/createaccount">sign up</Link></span>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
    )
}