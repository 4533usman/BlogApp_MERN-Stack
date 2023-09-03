import React, { useState, useEffect, useContext } from 'react'
import { formatISO9075 } from "date-fns";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { UserContext } from '../UserContext';
import profileImg from '../Images/profile-circle-icon.png'
const Post = () => {
    const [data, setData] = useState([]);
    const { userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setData(posts)
            })
        })
    }
        , [])
        console.log(data)
    const username = userInfo?.username;
    return (
        <main>
            {data.length > 0 ? data.map(post => (
                <div className='User-Post' key={post._id}>
                    <div className='User-Postfirst'>
                        <img src={`http://localhost:4000/${post.authorProfile}`} />
                        <div>
                            <h4>{post.author.username}</h4>
                            <p>{formatISO9075(new Date(post.createdAt))}</p>
                        </div>
                    </div>
                    <div className='User-Postsecond'>
                        <div className='User-Postseconddiv1'>
                            <h4>{post.title}</h4>
                            {/* <div>
                                <Link to={`/edit/${post._id}`}><img src={EditIcon} /></Link>
                                <Link><img src={DeleteIcon} /></Link>
                            </div> */}
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

            )) :
                <div className="background-NotFound">
                    <h1 style={{ textAlign: 'center' }}>Not Found Any Blog! 404</h1>
                    {username ?
                        <p style={{ textAlign: 'center' }}>
                            <Link className='btn-lg' to='/createpost'>Create Post</Link>
                        </p> :
                        <>
                            <p style={{ textAlign: 'center', fontSize: "30px" }}>Please Create Account and start writing blog. If you have already an account then please login and start writing</p>
                            <div className='reslog'>
                                <Link className='btn-lg' to='/login'>LogIn</Link>
                                <Link className='btn-lg' to='/register'>Create Account</Link>
                            </div>
                        </>}
                </div>
            }

        </main>
    )
}

export default Post