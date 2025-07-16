import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from "react-router";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function Login() {
  //feedback from createaccount
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  //Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      //Clear message after refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);


  /**
   * Handles the login form
   * @param e prevent default
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`${HOST}/api/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      navigate("/useroverview");
      console.log("Login successful");
    } else {
      const err = await res.json();
      console.error(err.error);
      setErrorMessage(err.error);
    }
  }

  return (
    <div id="login-form">
      {successMessage && (<div className="feedback-message success-message">{successMessage}</div>)}
      {errorMessage && (<div className="feedback-message error-message">{errorMessage}</div>)}
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <span>No account? <Link to="/createaccount">sign up</Link></span>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}