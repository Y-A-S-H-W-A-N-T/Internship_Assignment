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

router.post('/get-topic-video',async(req,res)=>{
    try{
        const result = await Videos.findOne({_id: req.body.topic_id,},'videos')
        console.log(result)
        if(result)
            res.status(200).send(result)
    }
    catch(err){
        res.status(400).json({msg: "Error in fetching Topic Video"})
    }
})

// Dev APIs
router.post('/postVideos',async(req,res)=>{
    const newVideo = new Videos(req.body)
    const result = await newVideo.save()
    res.send(result)
})

module.exports = router;
