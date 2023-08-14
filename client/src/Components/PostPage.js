import React, { useContext, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { formatISO9075 } from "date-fns";
import '../App.css'
import editIcon from '../Images/bx-edit-icon.png'
import deleteIcon from '../Images/delete-icon.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostPage = () => {
    const [postinfo, setPostinfo] = useState(null);
    const { id } = useParams()
    const { userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postinfo => {
                    setPostinfo(postinfo);
                });
            });
    }, []);
    const deleteHandler = async () => {
        const response = await fetch(`http://localhost:4000/delete/${id}`, {
            method: "DELETE",
        }
        )
        const json = await response.json();
        if (json.success === "true") {
            toast.success(json.message);
        }
        else if (json.success == "false") {
            toast.error(json.message);
        }
        else {
            toast.error(json.message);
        }
        if (!postinfo) return '';
        return (
            <main>
                <div className='post-page'>
                    <h1>{postinfo.title}</h1>
                    <div className='time-stamp'>
                        <time>{formatISO9075(new Date(postinfo.createdAt))}</time>
                    </div>
                    <div className='author'>by @{postinfo.author.username}</div>
                    {userInfo.id === postinfo.author._id &&
                        <div className='action-btn'>
                            <Link to={`/edit/${postinfo._id}`} >
                                <img src={editIcon} />
                            </Link>
                            <p onClick={deleteHandler}>
                                <img src={deleteIcon} />
                            </p>
                        </div>
                    }
                    <div className='image'>
                        <img src={`http://localhost:4000/${postinfo.cover}`} alt='' />
                    </div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: postinfo.content }} />
                </div>
            </main>
        )
    }
}

export default PostPage