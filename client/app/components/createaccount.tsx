import { useState } from "react";
import { useNavigate } from "react-router";

//Host from .env file
const HOST = import.meta.env.VITE_HOST;

export function CreateAccount() {
  //States
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('driver');
  const [phonenumber, setPhonnumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passwd, setPasswd] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>('');
  //Navigation
  const navigate = useNavigate();

  /**
   * Validates the form data
   * @returns errors in case of errors
   */
  function validate() {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = "Name is required";
    if (!surname.trim()) errs.surname = "Surname is required";
    if (!company.trim()) errs.company = "Company is required";
    //Check phonenumber
    if (!phonenumber.trim()) {
      errs.phonenumber = "Phone number is required";
    } else if (!/^\+?\d{7,15}$/.test(phonenumber)) {
      errs.phonenumber = "Invalid phone number";
    }
    //Check email
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
      errs.email = "Invalid email";
    }
    if (!passwd.trim()) {
      errs.passwd = "Password is required";
    } else {
      if (!/[A-Z]/.test(passwd)) {
        errs.passwd = "Password must contain at least one uppercase letter";
      } else if (!/[0-9]/.test(passwd)) {
        errs.passwd = "Password must contain at least one number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwd)) {
        errs.passwd = "Password must contain at least one special character";
      } else if (passwd.length < 8) {
        errs.passwd = "Password must be at least 8 characters long";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /**
   * Handle selectbox
   * @param event target event
   */
  const handleChange = (event: any) => {
    setSelectedRole(event.target.value);
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
    const res = await fetch(`${HOST}/adduser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, surname, company, phonenumber, email, passwd, selectedRole }),
    });

    const json = await res.json();

    if (res.ok) {
      console.log('Account created!');
      //Go back to home page when account creation is succesful
      navigate("/", { state: { successMessage: "Account created succesfully" } });
    } else {
      if (res.status === 409 && json.error === "Email already exists") {
        setServerError("Email already exists");
      } else {
        console.log('Error creating account');
        setServerError("An unexpected error occurred. Please try again.");
      }
    }

  }

  return (
    <div id="login-form">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name* {errors.name && <span className="color-red">{errors.name}</span>}:</label>
        <input className={errors.name ? "error" : ""} type="text" id="name" name="name" value={name} onChange={e => setName(e.target.value)} required />
        <label htmlFor="surname">Surname* {errors.surname && <span className="color-red">{errors.surname}</span>}:</label>
        <input className={errors.surname ? "error" : ""} type="text" id="surname" name="surname" value={surname} onChange={e => setSurname(e.target.value)} required />
        <label htmlFor="company">Company* {errors.company && <span className="color-red">{errors.company}</span>}:</label>
        <input className={errors.company ? "error" : ""} type="text" id="company" name="company" value={company} onChange={e => setCompany(e.target.value)} required />
        <label htmlFor="role">Role*</label>
        <select name="role" id="role" value={selectedRole} onChange={handleChange}>
          <option value="driver">Driver</option>
          <option value="operator">Operator</option>
        </select>
        <label htmlFor="phonenumber">Phone number* {errors.phonenumber && <span className="color-red">{errors.phonenumber}</span>}:</label>
        <input className={errors.phonenumber ? "error" : ""} type="tel" id="phonenumber" name="phonenumber" value={phonenumber} onChange={e => setPhonnumber(e.target.value)} required />
        <label htmlFor="email">Email* {errors.email || serverError && <span className="color-red">{errors.email || serverError}</span>}:</label>
        <input className={errors.email ? "error" : ""} type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="password">Password* {errors.passwd && <span className="color-red">{errors.passwd}</span>}:</label>
        <input className={errors.passwd ? "error" : ""} type="password" id="password" name="password" value={passwd} onChange={e => setPasswd(e.target.value)} required />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}