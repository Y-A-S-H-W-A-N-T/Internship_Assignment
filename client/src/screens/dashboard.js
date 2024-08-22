import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Videos } from '../component/videos'
import axios from 'axios'
import styles from '../styles/dash.module.css'

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
        <div className={styles.container}>
          <div className={styles.header}>
            <input
              type="text"
              placeholder="Search courses..."
              className={styles.searchBar}
            />
            <div className={styles.profileIcon}>P</div>
          </div>
          <h1 className={styles.courseTitle}>COURSES</h1>
          <div className={styles.cardsContainer}>
            {videos && videos.map((val, ind) => (
              <Link
                to={`/${val.topic_name}`}
                state={{ Topic: val }}
                className={styles.cardLink}
              >
                <div key={ind} className={styles.card}>
                    <h2>{val.topic_name}</h2>
                </div>
              </Link>
            ))}
          </div>
        </div>
    )
}

export default Dashboard