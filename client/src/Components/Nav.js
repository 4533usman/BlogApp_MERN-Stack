import React, { useContext, useEffect, useState } from 'react'
import '../App.css';
import {
    Link
} from 'react-router-dom'
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';
import profileImg from '../Images/profile-circle-icon.png'

const Nav = () => {
    const { setUserInfo, userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch("http://localhost:4000/profile",
            {
                credentials: "include"
            })
            .then(response => {
                response.json()
                    .then(userinfo => {
                        setUserInfo(userinfo)
                    })
            })
          
    }, [])
    const logoutHandler = async () => {
        const reponse = await fetch("http://localhost:4000/logout", {
            credentials: "include",
            method: "POST",
        })
        const json = await reponse.json();
        setUserInfo(null)
        toast.success(json.message)
    }
    const username = userInfo?.username;
    return (
        <main className=''>

            <header>
                <div>
                    <Link className='logo hover' to='/'>My Blog</Link>
                </div>
                <nav>
                    {username && (
                        <>
                            <Link className='nav-Links' to="/createpost">Create Post</Link>
                            <Link className='nav-Links' to="/login" onClick={logoutHandler}>Log Out</Link>
                            <Link className='Profile-icon' to="/userprofile"><img src={profileImg}/></Link>
                        </>
                    )}
                    {!username && (
                        <>
                            <Link className='nav-Links' to="login">Log In</Link>
                            <Link className='nav-Links' to='register'>Register</Link>
                        </>
                    )}
                </nav>
            </header>
        </main>
    )
}

export default Nav