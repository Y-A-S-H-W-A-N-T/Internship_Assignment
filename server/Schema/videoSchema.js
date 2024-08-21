const mongoose = require('mongoose')

const { Schema } = mongoose


const video = new Schema({
    video_number: String,
    video_URL: String
})

const videoSchema = new Schema({
    topic_name: String,
    videos: [video]
})

const Videos = mongoose.models['videos'] || mongoose.model('video', videoSchema)

module.exports = { Videos }