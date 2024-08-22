const mongoose = require('mongoose')

const { Schema } = mongoose


const video = new Schema({ // store watched videos in userSchema
    video_number: String,
    video_URL: String
})

const videoSchema = new Schema({ // store watched topics in userSchema
    topic_name: String,
    videos: [video]
})

const Videos = mongoose.models['videos'] || mongoose.model('video', videoSchema)

module.exports = { Videos }