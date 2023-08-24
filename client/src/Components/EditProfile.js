import React, { useEffect, useState } from 'react'
import '../App.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const EditProfile = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [files, setFiles] = useState('');
    const [id , setId] = useState('');
    const [user, setUser] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        fetch('http://localhost:4000/userprofile', {
            method: 'GET',
            credentials: 'include'

        }).then(response => {
            response.json().then(e => {
                console.log(e)
                setUser(e)
                setUsername(e.username)
                setEmail(e.email)
                setId(e._id)

            })
        })
    }, [])
    console.log(user)
    const submitHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('username', username);
        // data.set('password', password);
        data.set('email', email);
        data.set('id', id)
        data.set('file', files[0]);
        const response = await fetch("http://localhost:4000/editprofile", {
            method: 'PUT',
            body: data,
        })
        // console.log(files)
        const json = await response.json()
        if(json.success) {
            toast.success(json.message)
            navigate('/userprofile')
        }
        else{
            toast.error(json.error)
        }
    }
    return (
        <main>
            <form className="form" onSubmit={submitHandler}>
                <h1>Update Profile</h1>
                <img alt='No File Uploaded..' src={files ? URL.createObjectURL(files[0]) : `http://localhost:4000/${user.cover}`} className='profile-img' />
                <input type='file'
                    onChange={e => { setFiles(e.target.files) }}
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
                {/* <input type='password' placeholder='Psssword'
                    value={password}
                    onChange={e => { setPassword(e.target.value) }}
                    required
                /> */}
                <button>Update Profile</button>
            </form>
        </main>
    )
}
export default EditProfile