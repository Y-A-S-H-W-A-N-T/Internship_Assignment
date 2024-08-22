import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from '../styles/profile.module.css'

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

  console.log(user)


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
                  <h3>Videos Watched: {module.module_videos.length}</h3>
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