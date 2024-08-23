const express = require('express')
const router = express.Router()
const { Videos } = require('../Schema/videoSchema')

router.post('/test',async(req,res)=>{
    console.log("DATA : ",req.body)
    res.status(200).send()
})

router.post('/get-videos',async(req,res)=>{
    try{
        const result = await Videos.find({})
        if(result)
            res.status(200).send(result)
    }
    catch(err){
        res.status(400).json({msg: "Error in fetching Videos"})
    }
})

router.post('/get-topic-video', async (req, res) => {
    const { topic_id, video_number } = req.body;
    try {
        const topic = await Videos.findOne({ _id: topic_id });
        if (!topic) {
            return res.json({ message: 'Topic not found' });
        }

        // Find the video by video_number
        const video = topic.videos[video_number-1]

        console.log(video)

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.status(200).json({ video });
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Dev APIs
router.post('/postVideos',async(req,res)=>{
    const newVideo = new Videos(req.body)
    const result = await newVideo.save()
    res.send(result)
})

module.exports = router;
