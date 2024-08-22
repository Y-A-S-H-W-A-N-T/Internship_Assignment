const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const videoRoutes = require('./API/videoRoutes')
const userRoutes = require('./API/userRoutes')

const mongoose = require('mongoose')


app.use(bodyParser.json())
app.use(cors())


app.use("/video",videoRoutes)
app.use("/user",userRoutes)


mongoose.connect(process.env.MONGOOSE_URL).then(()=>{
    console.log("Connected")
})

app.listen(8000,(err)=>{
    if(err) return err
    console.log("Server Running")
})