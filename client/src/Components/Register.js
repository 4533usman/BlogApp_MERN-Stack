import React, { useState } from 'react'
import '../App.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-type': 'application/json' },

    })
    const json = await response.json()
    if (json.status === 409) {
      toast.warn(json.message);
    }
    else {
      toast.success(json.message);
      navigate('/login')
    }
  }
  return (
    <main>
      <form className="form" onSubmit={submitHandler}>
        <h1>Register</h1>
        <input type='text' placeholder='Username'
          value={username}
          onChange={e => { setUsername(e.target.value) }}
          required
        />
        <input type='email' placeholder='Email Address'
          value={email}
          onChange={e => { setEmail(e.target.value) }}
          required
        />
        <input type='password' placeholder='Psssword'
          value={password}
          onChange={e => { setPassword(e.target.value) }}
          required
        />
        <button>Register</button>
      </form>
    </main>
  )
}

export default Register