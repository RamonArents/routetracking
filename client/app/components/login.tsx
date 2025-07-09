import { Link } from 'react-router-dom'

export function Login(){
    return (
    <div id="login-form">
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