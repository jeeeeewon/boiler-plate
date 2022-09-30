import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Auth from '../../../hoc/auth';
import { Card, Avatar, Col, Row, Typography } from 'antd';
// import video from 'fluent-ffmpeg/lib/options/video';

import moment from 'moment';
const { Meta } = Card;
const { Title } = Typography;

function LandingPage() {
    const [Video, setVideo] = useState([]);
 
    useEffect(() => {
      axios.get("/api/video/getVideos")
        .then(response => {
            if(response.data.success){
                setVideo(response.data.videos)
            } else{
                alert('Failled to import video')
            }
        })
    }, [])

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes * 60));

        return <Col key={index} lg={6} md={8} xs={24}>
            <a href={`/video/post/${video._id}`}>
                <div style={{ position: "relative" }}>
                    <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                    <div className='duration'>
                        <span>{minutes}: {seconds}</span>
                    </div>
                </div>
            </a>
            <br />
            <Meta 
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title= {video.title}
                description=""
            />
            <span style={{ marginLeft: "3rem" }}>{video.writer.name} </span><br />
            <span style={{ marginLeft: "3rem" }}>{video.views} views</span> - <span>{moment(video.createAt).format("MM Do YY")}</span>
        </Col>
        
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto'}}>
            <Title level={2} > Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>
        </div>
    )
}

export default Auth(LandingPage, null);
