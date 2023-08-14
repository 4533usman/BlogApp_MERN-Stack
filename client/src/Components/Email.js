import React, { useState } from 'react'
import { toast } from 'react-toastify';
import '../App.css'

const Email = () => {
    const [email, setEmail] = useState();
    const emailsendHandler = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:4000/forgetpassword",
            {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: "include",
            }
        )
        const json = await response.json()
        console.log(json)
        if (json.status === 404) {
            toast.warn(json.message)
        }
        else if (json.status === 500) {
            toast.error(json.message)
        }
        else {
            toast.success(json.message)
        }
    }
    return (
        <main>
            <form onSubmit={emailsendHandler}>
                <h1>Recover Your Password</h1>
                <input type="email" placeholder='Email address'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button>Send mail</button>
            </form>
        </main>
    )
}

export default Email