import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/dash.module.css'
import LOGO from '../component/logos/intern_logo.png'

function Dashboard() {

    const [videos,setVideos] = useState()
    const navigate = useNavigate()

    const user_name = window.localStorage.getItem('userNAME')

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
            <img src={LOGO} height={100} width={100}/>
            <div onClick={()=> navigate('/profile')} className={styles.profileIcon}> {user_name && <a style={{textDecoration: 'none', color: 'black'}}>{user_name[0]}</a>} </div>
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
                    <h3>Total Videos : {val.videos.length}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
    )
}

export default Dashboard