import React, { useContext, useEffect, useState } from 'react'
import '../App.css';
import {
    Link
} from 'react-router-dom'
import { UserContext } from '../UserContext';
import { toast } from 'react-toastify';

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
                <Link className='logo hover' to='/'>My Blog</Link>
                <nav>
                    {username && (
                        <>
                            <Link to="/createpost">Create Post</Link>
                            <Link to="/login" onClick={logoutHandler}>Log Out</Link>

                        </>
                    )}
                    {!username && (
                        <>
                            <Link to="login">Log In</Link>
                            <Link to='register'>Register</Link>
                        </>
                    )}
                </nav>
            </header>
        </main>
    )
}

export default Nav