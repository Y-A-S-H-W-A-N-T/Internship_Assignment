import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '../styles/profile.module.css'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router';

function Profile() {

  const userID = window.localStorage.getItem('userID')
  const navigate = useNavigate()

  const [user,setUser] = useState()

  const fetchUser = async()=>{
    await axios.post('http://localhost:8000/user/get-user',{
      id: userID
    })
    .then((res)=>{
      if(res.status === 200){
        console.log(res.data.data)
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

  const Logout = async()=>{
    window.localStorage.removeItem('userID')
    window.localStorage.removeItem('userNAME')
    navigate('/',{replace: true})
  }

  return (
    <div className={styles.profileContainer}>
      {user && (
        <div className={styles.profileContent}>
          <div className={styles.profileLogo}>
            <h1>{user.data.user[0]}</h1>
          </div>
          <div className={styles.profileName}>
            <h1>{user.data.user}</h1>
          </div>
          <div className={styles.logoutButton} onClick={Logout}>
            <h2>LOGOUT</h2>
          </div>
          <div className={styles.modulesContainer}>
            {user.data.modules_watched.map((module, ind) => (
              <div key={ind} className={styles.moduleCard}>
                <div className={styles.moduleContent}>
                  <h2>{module.module_name}</h2>
                  <h3>Completed : {user.CompletedVideos[ind].length}/{module.total_module_video}</h3>
                </div>
                <div className={styles.circularProgressContainer}>
                  <CircularProgressbar 
                    value={user.CompletedVideos[ind].length / module.total_module_video * 100} 
                    text={`${Math.round(user.CompletedVideos[ind].length / module.total_module_video * 100)}%`} 
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