import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from '../styles/login.module.css'

function Login() {

    const [user,setUser] = useState({
        name: '',
        password: ''
    })
    const naviigate = useNavigate()

    const Login = async()=>{
        if(user.name === '' || user.password === '')
            return alert("Enter Credentials")
        await axios.post('http://localhost:8000/user/login',{
            user: user.name,
            password: user.password
        })
        .then((res)=>{
            console.log(res)
            if(res.status === 200){
                window.localStorage.setItem('userID',res.data._id)
                window.localStorage.setItem('userNAME',res.data.user)
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
            }
            else{
                alert("Error in Login")
            }
            return
        })
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
                <button className={styles.button} onClick={Login}>LOGIN</button>
            </div>
        </div>
    )
}

export default Login