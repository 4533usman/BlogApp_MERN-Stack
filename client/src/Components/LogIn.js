import React, { useContext, useState } from 'react'
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  const { setUserInfo } = useContext(UserContext)
  const submitHandler = async (e) => {
    e.preventDefault()

    const response = await fetch("http://localhost:4000/login",
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-type': 'application/json',
        },
        credentials: "include",
      }
    )
    const json = await response.json();
    console.log(json)
    if (json.success) {
      toast.error(json.message);
      setEmail("")
      setPassword("")
    }
    else if (json.status === 404) {
      toast.warn(json.message);
      setEmail("")
      setPassword("")
    }
    else {

      toast.success(json.message);
      setUserInfo(json);
      console.log(json);
      navigate('/')
    }
  }
  return (
    <div className=''>
      <main className=''>
        <form className="form" onSubmit={submitHandler}>
          <h1>Log In</h1>
          <input type='text' placeholder='Email Address'
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            required
          />
          <input type='password' placeholder='Psssword'
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            required
          />
          <button>Log In</button>
        </form>

        <p className='p-passRecovery'>
          <Link to='/forgetpassword'>Forget Password?</Link>
        </p>
      </main>
    </div>
  )
}

export default LogIn