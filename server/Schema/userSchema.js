const mongoose = require('mongoose')

const { Schema } = mongoose


const videos = new Schema({
    video_id: String,
    progress: String ,
    duration: String // if the plan changes to resume video
})

const modules = new Schema({
    module_id: String,
    module_name: String,
    module_videos: [videos]
})

const userSchema = new Schema({
    user: String,
    password: String,
    modules_watched:[modules]
})

const Users = mongoose.models['user'] || mongoose.model('user', userSchema)

module.exports = { Users }