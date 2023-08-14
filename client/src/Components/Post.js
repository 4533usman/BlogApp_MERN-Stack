import React, { useState, useEffect } from 'react'
import { formatISO9075 } from "date-fns";
import { Link } from 'react-router-dom';
import '../App.css';

const Post = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                setData(posts)
            })
        })

    }
        , [])
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
            )):<h1>NoThing To Display</h1>}

        </main>
    )
}

export default Post