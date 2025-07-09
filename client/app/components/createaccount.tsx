import { useState } from "react"

export function CreateAccount(){
    const [ name, setName] = useState('');
    const [ surname, setSurname] = useState('');
    const [ company, setCompany] = useState('');
    const [ phonenumber, setPhonnumber] = useState('');
    const [ email, setEmail] = useState('');
    const [ password, setPassword] = useState('');

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      //TODO: API moet nog gebouwd worden.
      const res = await fetch('http://localhost:4000/adduser', {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, company, phonenumber, email, password })
      });

      if(res.ok){
        console.log('Account created!');
      } else {
        console.log('Error creating account');
      }
    }

    return (
    <div id="login-form">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} />
        <label htmlFor="surname">Surname:</label>
        <input type="text" id="surname" name="surname" value={surname} onChange={e => setSurname(e.target.value)} />
        <label htmlFor="company">Company:</label>
        <input type="text" id="company" name="company" value={company} onChange={e => setCompany(e.target.value)} />
        <label htmlFor="phonenumber">Phone number:</label>
        <input type="number" id="phonenumber" name="phonenumber" value={phonenumber} onChange={e => setPhonnumber(e.target.value)} />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
        <br />
        {/* TODO: Meldingen maken met success en foutmeldingen */}
        {/* <div className="error">{succes ? 'Account successfully created.' : 'There was an error creating your account.'}</div> */}
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
    )
}