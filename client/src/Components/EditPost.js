import React, { useEffect, useState } from 'react'
import Editer from './Editer'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'


const EditPost = () => {
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContent] = useState("")
    const [files, setFiles] = useState("")
    const { id } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postinfo => {
                    setTitle(postinfo.title);
                    setSummary(postinfo.summary);
                    setContent(postinfo.content);

                });
            })
    },
        []
    )
    const updatePost = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('id', id);
        if (files?.[0]) {
            data.set('file', files?.[0]);
        }
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if (response.ok) {
            navigate(`/post/${id}`)
        }
        const json = await response.json()
        toast.success(json.message)
    }
    return (
        <main>
            <form onSubmit={updatePost}>
                <input type="title"
                    placeholder={'Title'}
                    value={title}
                    onChange={e => setTitle(e.target.value)} />
                <input type="summary"
                    placeholder={'Summary'}
                    value={summary}
                    onChange={e => setSummary(e.target.value)} />
                <input type="file"
                    onChange={e => setFiles(e.target.files)} />
                <Editer onChange={setContent} value={content} />
                <button style={{ marginTop: '5px' }}>Update post</button>
            </form>
        </main>
    )
}

export default EditPost