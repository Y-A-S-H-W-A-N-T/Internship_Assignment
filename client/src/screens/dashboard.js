import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Videos } from '../component/videos'
import axios from 'axios'

function Dashboard() {

    const [videos,setVideos] = useState()

    const fetchVideos = async()=>{
        await axios.post('http://localhost:8000/video/get-videos')
        .then((res)=>{
            console.log(res)
            if(res.status === 200)
                setVideos(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetchVideos()
    },[])


  return (
    <div>
        <h1>List All courses here.</h1>
        {videos &&<div>
            {
                videos.map((val,ind)=>(
                    <div key={ind}>
                        <ul>
                            <Link to={`/${val.topic_name}`} state={{Topic: val}}>
                                {val.topic_name}
                            </Link>
                        </ul>
                    </div>
                ))
            }
        </div>}
    </div>
  )
}

export default Dashboard