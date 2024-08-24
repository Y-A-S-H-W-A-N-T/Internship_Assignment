import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from '../styles/dash.module.css'
import LOGO from '../component/logos/intern_logo.png'
import MP from '../component/logos/mp.png'
import VIDEOS from '../component/logos/videos.png'

function Dashboard() {

    const [videos,setVideos] = useState()
    const [search,setSearch] = useState('')
    const navigate = useNavigate()

    const user_name = window.localStorage.getItem('userNAME')

    const fetchVideos = async()=>{
        await axios.post('https://coursestream.onrender.com/video/get-videos')
        .then((res)=>{
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

    // search / filter videos here
    // navigate to user profile

    return (
        <div className={styles.container}>
          <div className={styles.header}>
            <img src={LOGO} height={100} width={100}/>
            <h1 className={styles.courseTitle}>Course<span style={{color: '#e8857c'}}>Stream</span></h1>
            <div onClick={()=> navigate('/profile')} className={styles.profileIcon}> {user_name && <a style={{textDecoration: 'none', color: 'black'}}>{user_name[0]}</a>} </div>
          </div>
          <div className={styles.searchbar}>
            <input placeholder='eg: ppe/driving/medic' onChange={(e)=>setSearch(e.target.value)}/>
          </div>
          <div className={styles.cardsContainer}>
            {videos && videos
              .filter((val) => 
                !search || val.topic_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((val, ind) => (
                <Link
                  to={`/${val.topic_name}`}
                  state={{ Topic: val }}
                  className={styles.cardLink}
                >
                  <div key={ind} style={{borderBottom: '2px solid grey', paddingBottom: 15, fontFamily: 'cursive', fontSize: '1rem'}}>
                        <img src={MP} height={250} width={250}/>
                      <div style={{marginTop: -50}}>
                        <div style={{display: 'flex', float: 'left', marginLeft: 40}}>
                          <h2>{val.topic_name}</h2>
                        </div>
                        <div style={{display: 'flex', float: 'right',marginRight: 40}}>
                          <h3><img src={VIDEOS} height={20} width={20}/> {val.videos.length}</h3>
                        </div>
                      </div>
                  </div>
              </Link>
            ))}
          </div>
        </div>
    )
}

export default Dashboard