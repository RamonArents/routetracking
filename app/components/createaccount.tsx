export function CreateAccount(){
    return (
    <div id="login-form">
      <h1>Register</h1>
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="surname">Surname:</label>
        <input type="text" id="surname" name="surname" />
        <label htmlFor="company">Company:</label>
        <input type="text" id="company" name="company" />
        <label htmlFor="phonenumber">Phone number:</label>
        <input type="number" id="phonenumber" name="phonenumber" />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
    )
}