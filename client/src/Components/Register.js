import React, { useState } from 'react'
import '../App.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState('');  const navigate = useNavigate()
  const submitHandler = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set('username', username);
    data.set('password', password);
    data.set('email', email);
    data.set('file', files[0]);
    const response = await fetch("http://localhost:4000/register", {
      method: 'POST',
      body: data , 
    })
    console.log(files)
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
        <img alt='No File Uploaded..' src={files ? URL.createObjectURL(files[0]) : ''} className='profile-img' />
        <input type='file'
          onChange={e => { setFiles(e.target.files)}}
          required
        />
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