import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
const UserProfile = () => {
    const [user, setUser] = useState([])
    useEffect(() => {
        fetch('http://localhost:4000/userprofile', {
            method: 'GET',
        }).then(response => {
            response.json().then(e => {
                setUser(e)
            })
        })
        console.log(user)
    }, [])
    return (
        <main>
            <div className='profile-card'>

                <div className='img-frame'></div>
                <div className='ptext'>Username: </div>
                <div className='ptext'>Email Address: </div>
                <div className='ptext'>Profile CreatedAt: </div>
                <div className='btn-group'>
                    <Link className='nav-Links' to="/updateprofile">Update Profile</Link>
                    <Link className='nav-Links' to='updatepassword'>Update Password</Link>
                </div>

            </div>
        </main>
    )
}

export default UserProfile