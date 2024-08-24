const mongoose = require('mongoose')

const { Schema } = mongoose

const videos = new Schema({
    video_id: String,
    duration: String,
    video_duration: String
})

const modules = new Schema({
    module_id: String,
    module_name: String,
    total_module_video: String,
    module_videos: [videos]
})

const userSchema = new Schema({
    user: String,
    password: String,
    modules_watched:[modules]
})

const Users = mongoose.models['user'] || mongoose.model('user', userSchema)

module.exports = { Users }