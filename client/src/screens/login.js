import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

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
    <div>
        <div>
        <input placeholder='user' onChange={(e)=>setUser((prev)=>({...prev,name: e.target.value}))} value={user.name}/>
        <input placeholder='password' onChange={(e)=>setUser((prev)=>({...prev,password: e.target.value}))} value={user.password}/>
        <button onClick={Login}>LOGIN</button>
        </div>
    </div>
  )
}

export default Login