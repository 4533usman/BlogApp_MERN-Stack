import React, { useState, useEffect, useContext } from 'react'
import { formatISO9075 } from "date-fns";
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { UserContext } from '../UserContext';
const Post = () => {
    const [data, setData] = useState([]);
    const { userInfo } = useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setData(posts)
            })
        })
        console.log(userInfo)
    }
        , [])
    const username = userInfo?.username;
    return (
        <main>
            {data.length > 0 ? data.map(data => (
                <div className='post' key={data._id}>
                    <Link to={`/post/${data._id}`}>
                        <div className='pic'>
                            <img src={'http://localhost:4000/' + data.cover} alt="" />
                        </div>
                    </Link>
                    <div className='content'>
                        <h2>
                            <Link className="my-link" to={`/post/${data._id}`}>
                                {data.title}
                            </Link>
                        </h2>
                        <p className='info'>
                            <author>{data.author.username}</author>
                            <time>{formatISO9075(new Date(data.createdAt))}</time>
                        </p>
                        <p className='summary'>
                            {data.summary.length < 200 ? data.summary : data.summary.slice(0, 200) + "  ...."}
                        </p>
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