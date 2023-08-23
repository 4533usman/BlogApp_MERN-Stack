import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import EditProfile from '../Images/Edit-Profile.png'
import ChangePassword from '../Images/Edit-Password.png'

const UserProfile = () => {
    const [user, setUser] = useState([])
    useEffect(() => {
        fetch('http://localhost:4000/userprofile', {
            method: 'GET',
            credentials: 'include'

        }).then(response => {
            response.json().then(e => {
                console.log(e)
                setUser(e)
            })
        })
    }, [])
    console.log(user)
    return (
        <main>
            <div className='profile-card'>

                <div className='img-frame'>
                    <img src={`http://localhost:4000/${user.cover}`} />
                </div>
                <div className='ptext'>{user.username}</div>
                <div className='btn-group'>
                    <Link to="/editprofie"><img src={EditProfile} height={30} width={30} /></Link>
                    <Link to='changepassword'><img src={ChangePassword} height={30} width={30} /></Link>
                </div>

            </div>
        </main>
    )
}

export default UserProfile