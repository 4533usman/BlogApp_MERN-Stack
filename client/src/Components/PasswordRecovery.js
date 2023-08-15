import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const PasswordRecovery = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { email, token } = useParams()
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.warn('Passwords do not match.');
            return;
        }
        try {
            const response = await fetch('http://localhost:4000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                })
            });
            const json = await response.json();
            if (json.message) {
                toast.success(json.message);
                navigate('/login');
                // You could also redirect the user to a login page or provide further instructions
            } else {
                toast.error(json.error)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <main>
            <form onSubmit={handleSubmit}>
                <input type='password' required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder='newPassword' />
                <input type='password' required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder='Confirm Password'
                    />
                <button>Reset Password</button>
            </form>
        </main>
    )
}

export default PasswordRecovery