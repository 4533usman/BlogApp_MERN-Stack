import React, { useState } from 'react'
import '../App.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const ChangePassword = () => {
    const [newpassword, setnewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const changePasswordHandler = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/changePassword",
            {
                method: 'POST',
                body: JSON.stringify({ newpassword, confirmpassword }),
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: "include",
            }
        )
        const json = await response.json();
        console.log(json)
        if(json.error){
            toast.error(json.error)
            setnewPassword('')
            setConfirmPassword('')
        }
        else{
            toast.success(json.success)
            navigate('/userprofile')
        }
    }
    return (
        <main>
            <form onSubmit={changePasswordHandler}>
                <input type='password' placeholder='Password' value={newpassword} onChange={e => setnewPassword(e.target.value)} />
                <input type='password' placeholder='Confirm Password' value={confirmpassword} onChange={e => setConfirmPassword(e.target.value)} />
                <button>ChangePassword</button>
            </form>
        </main>
    )
}

export default ChangePassword