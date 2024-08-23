import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '../styles/profile.module.css'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';

function Profile() {

  const userID = window.localStorage.getItem('userID')

  const [user,setUser] = useState()

  const fetchUser = async()=>{
    await axios.post('http://localhost:8000/user/get-user',{
      id: userID
    })
    .then((res)=>{
      if(res.status === 200){
        setUser(res.data)
      }
      else{
        console.log("Error while fetching user")
      }
    })
  }

  useEffect(()=>{
    fetchUser()
  },[])

  return (
    <div className={styles.profileContainer}>
      {user && (
        <div className={styles.profileContent}>
          <div className={styles.profileLogo}>
            <h1>{user.user[0]}</h1>
          </div>
          <div className={styles.profileName}>
            <h1>{user.user}</h1>
          </div>
          <div className={styles.modulesContainer}>
            {user.modules_watched.map((module, ind) => (
              <div key={ind} className={styles.moduleCard}>
                <div className={styles.moduleContent}>
                  <h2>{module.module_name}</h2>
                  <h3>Completed : {module.module_videos.length}/{module.total_module_video}</h3>
                </div>
                <div className={styles.circularProgressContainer}>
                  <CircularProgressbar 
                    value={module.module_videos.length / module.total_module_video * 100} 
                    text={`${Math.round(module.module_videos.length / module.total_module_video * 100)}%`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile