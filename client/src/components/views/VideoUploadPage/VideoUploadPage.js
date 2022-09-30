import React, { useState } from 'react'
import Auth from '../../../hoc/auth';
import Dropzone from "react-dropzone";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"},
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
    {value: 4, label: "Sports"},
]

function VideoUploadPage() {
    const navigate = useNavigate();

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");

    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }
    
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {"content-type": "multipart/form-data"}
        }
        formData.append("file", files[0])

        axios.post('/api/video/uploads', formData, config)
            .then(response => {
                if(response.data.success) {

                    let variable = {
                        url: response.data.url,
                        filename: response.data.filename
                    }

                    setFilePath(response.data.url);
                    
                    axios.post('/api/video/thumbnails', variable)
                    .then(response => {
                        if(response.data.success) {
                            setDuration(response.data.fileDuration);
                            setThumbnailPath(response.data.url);
                        } else{
                            alert("Failed to create a thumbnail")
                        }
                    })
                } else {
                    alert("Faliled to upload video")
                }
            })
    }

    const user = useSelector(state => state.user);

    const onSubmit = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration, 
            thumbnail: ThumbnailPath
        }
        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success){
                    message.success("Video upload was successful");
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else{
                    alert('Faliled to upload video')
                }
            })
    }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{ textAlign: 'center', marginBottom: "2rem" }}>
            <Title level={2}>Upload Video</Title>
        </div>

        <Form onSubmit={onSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between"}}>
                {/* { Drop Zone } */}
                <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={1000000000}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div style={{ width: "300px", height: "240px", border: "1px solid lightgrey", display: 'flex', alignItems: "center", justifyContent: "center"}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <PlusOutlined style={{ fontSize: "3rem" }}/>
                        </div>
                    )}
                </Dropzone>

                {/* { Thumnail } */}
                {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                    </div>
                }
            </div>

            < br/>
            < br/>

            <label>Title</label>
            <Input 
                onChange={onTitleChange}
                value={VideoTitle}
            />

            <br />
            <br />

            <label>Description</label>
            <TextArea
                onChange={onDescriptionChange}
                value={Description}
            />

            <br />
            <br />

            <select onChange={onPrivateChange}>
                {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />

            <select onChange={onCategoryChange}>
            {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>

            <br />
            <br />

            <Button type='primary' size='large' onClick={onSubmit} >
                Submit
            </Button>

        </Form>
    </div>
  )
}

export default Auth(VideoUploadPage, true);