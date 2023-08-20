import React, { useState } from 'react'
import Editer from './Editer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const navigate = useNavigate();

    const createPostHandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include'
        })
        console.log(files)
        if (response.ok) {
            navigate('/');
        }
        const json = await response.json();
        toast.success(json.message)
    }
    return (
        <form onSubmit={createPostHandler}>
            <input placeholder='title'
                onChange={e => { setTitle(e.target.value); }}
                value={title}
                required
            />
            <input placeholder='Summary'
                onChange={e => { setSummary(e.target.value); }}
                value={summary}
                required
            />
            <input type='file'
                onChange={e => { setFiles(e.target.files); }}
                required
            />
            <Editer value={content} onChange={setContent}
                required />
            <button style={{ marginTop: 8 }}>Create Post</button>
        </form>
    )
}

export default CreatePost