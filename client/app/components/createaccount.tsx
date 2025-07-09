import { useState } from "react";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function CreateAccount() {
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phonenumber, setPhonnumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [wrongPhonenumber, setWrongPhonenumber] = useState<string>('');
  const [wrongEmail, setWrongEmail] = useState<string>('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let isValid:boolean = true;

    //TODO: Change this to a more react approach.
    const emailInput:any = document.getElementById("email");
    const phoneInput:any = document.getElementById("phonenumber");

    //phonenumber
    if (!/^\+?\d{7,15}$/.test(phonenumber)) {
      phoneInput.classList.add("error");
      console.log("Wrong format phonenumber");
      isValid = false;
      setWrongPhonenumber('Phonenumber is invalid.');
      //email
    } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      emailInput.classList.add("error");
      console.log("Wrong format email");
      isValid = false;
      setWrongEmail('Email is invalid.');
    } else {
      phoneInput.classList.remove("error");
      setWrongEmail('');
      setWrongPhonenumber('');    
    }

    if(isValid){

      const res: any = await fetch(`${HOST}/adduser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, company, phonenumber, email, password })
      });

      if (res.ok) {
        console.log('Account created!');
      } else {
        console.log('Error creating account');
      }
    }
  }

  return (
    <div id="login-form">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name*:</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required />
        <label htmlFor="surname">Surname*:</label>
        <input type="text" id="surname" name="surname" value={surname} onChange={e => setSurname(e.target.value)} required/>
        <label htmlFor="company">Company*:</label>
        <input type="text" id="company" name="company" value={company} onChange={e => setCompany(e.target.value)} required/>
        <label htmlFor="phonenumber">Phone number* <span className="color-red">{wrongPhonenumber}</span>:</label>
        <input type="tel" id="phonenumber" name="phonenumber" value={phonenumber} onChange={e => setPhonnumber(e.target.value)} required/>
        <label htmlFor="email">Email* <span className="color-red">{wrongEmail}</span>:</label>
        <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required/>
        <label htmlFor="password">Password*:</label>
        <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} required/>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}