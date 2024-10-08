import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/login.module.css'

function Login() {

    //basic login

    const [user,setUser] = useState({
        name: 'Yashwant',
        password: '1234'
    })
    const [loading,setLoading] = useState(false)
    const naviigate = useNavigate()

    const Login = async()=>{
        setLoading(true)
        if(user.name === '' || user.password === '')
            return alert("Enter Credentials")
        await axios.post('https://coursestream.onrender.com/user/login',{
            user: user.name,
            password: user.password
        })
        .then((res)=>{
            if(res.status === 200){
                window.localStorage.setItem('userID',res.data._id)
                window.localStorage.setItem('userNAME',res.data.user)
                setLoading(false)
                naviigate('/dashboard',{ replace: true })
            }
        })
        .catch((err)=>{
            if(err.response.status === 404){
                setUser({
                    name: '',
                    password: ''
                });
                alert(err.response.data.msg)
                setLoading(false)
            }
            else{
                alert("Error in Login")
            }
            return
        })
        setLoading(false)
    }


    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <input
                    className={styles.input}
                    placeholder='user'
                    onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                    value={user.name}
                />
                <input
                    className={styles.input}
                    placeholder='password'
                    onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                    value={user.password}
                />
                <button className={styles.button} onClick={Login}>{loading? 'LOADING':'LOGIN'}</button>
            </div>
            <div className={styles.userList}>
                <h2 onClick={()=>setUser({name: 'Yashwant', password: '1234'})}>USER 1</h2>
                <h2 onClick={()=>setUser({name: 'Soumya', password: '123'})}>USER 2</h2>
                <h2 onClick={()=>setUser({name: 'Abish', password: '0000'})}>USER 3</h2>
            </div>
        </div>
    )
}

export default Login