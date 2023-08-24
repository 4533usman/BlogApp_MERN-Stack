import React, { useEffect, useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import EditProfile from '../Images/Edit-Profile.png'
import ChangePassword from '../Images/Edit-Password.png'
import { formatISO9075 } from "date-fns";
import EditIcon from '../Images/edit.png'
import DeleteIcon from '../Images/delete-icon.png'


const UserProfile = () => {
    const [user, setUser] = useState([])
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('http://localhost:4000/userprofile', {
            method: 'GET',
            credentials: 'include'

        }).then(response => {
            response.json().then(e => {
                // console.log(e)
                setUser(e)
            })
        })
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setData(posts)
            })
        })
    }, [])
    // console.log(data)
    return (
        <main>
            <div className='profile-card'>

                <div className='img-frame'>
                    <img src={`http://localhost:4000/${user.cover}`} />
                </div>
                <div className='ptext'>{user.username}</div>
                <div className='btn-group'>
                    <Link to="/editprofile"><img src={EditProfile} height={30} width={30} /></Link>
                    <Link to='/changepassword'><img src={ChangePassword} height={30} width={30} /></Link>
                </div>

            </div>
            {data.map(post => (

                user._id === post.author._id &&
                <div className='User-Post' key={post._id}>
                    <div className='User-Postfirst'>
                        <img src={`http://localhost:4000/${user.cover}`} />
                        <div>
                            <h4>{post.author.username}</h4>
                            <p>{formatISO9075(new Date(post.createdAt))}</p>
                        </div>
                    </div>
                    <div className='User-Postsecond'>
                        <div className='User-Postseconddiv1'>
                            <h4>{post.title}</h4>
                            <div>
                                <Link to={`/edit/${post._id}`}><img src={EditIcon} /></Link>
                                <Link><img src={DeleteIcon} /></Link>
                            </div>
                        </div>
                        <div>
                            <p>{post.summary}</p>
                        </div>
                    </div>
                    <div className='User-Postthird'>
                        <Link to={`/post/${post._id}`}>
                            <img src={`http://localhost:4000/${post.cover}`} />
                        </Link>
                    </div>
                </div>

            ))}

        </main>
    )
}

export default UserProfile