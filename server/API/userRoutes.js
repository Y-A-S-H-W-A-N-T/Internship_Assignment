const express = require('express');
const router = express.Router();
const { Users } = require('../Schema/userSchema')

router.post('/test',async(req,res)=>{
    console.log("DATA : ",req.body)
})


router.post('/login',async(req,res)=>{
    let user = null
    user = await Users.findOne(req.body)
    console.log(user)
    if (user === null) {
        return res.status(404).json({ msg: 'User Not Found' });
    }
    return res.status(200).send(user);
})

router.post('/store-progress', async (req, res) => {
    const { user_ID, topic_id, video_id, progress, topic } = req.body
    try {
        const user = await Users.findById(user_ID)
        if (!user) {
            return res.json({ msg: 'User not found' });
        }
        let module = user.modules_watched.find(m => m.module_id === topic_id);
        if (module) {
            const videoExists = module.module_videos.some(v => v.video_id === video_id);
            if (videoExists) {
                console.log("Video Exists") //
                return res.json({ msg: 'Video already exists in this module' });
            } else {
                console.log('Video Added') //
                module.module_videos.push({ video_id: video_id, progress: progress });
            }
        } else {
            console.log("Module Added") //
            user.modules_watched.push({
                module_id: topic_id,
                module_name: topic,
                module_videos: [{ video_id: video_id, progress: progress }]
            });
        }
        await user.save();

        return res.status(200).json({ msg: 'Video added successfully' });

    } catch (error) {
        console.error(error);
        return res.json({ msg: 'Server error' });
    }
})

router.post('/get-module-progress', async (req, res) => {
    const { topic_id, user_ID } = req.body
    try {
        const user = await Users.findById(user_ID);
        console.log(user)
        if (!user) {
            return res.status(404).json({ msg: 'User Not Found' });
        }
        const module = user.modules_watched.find(m => m.module_id === topic_id)
        if (module) {
            return res.status(200).json({ completed_videos: module.module_videos })
        } else {
            return res.status(404).json({ msg: 'Module Not Found' })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' })
    }
});


// Dev APIs

router.post('/addUser',async(req,res)=>{
    const user = {
        user: 'Soumya',
        password: '123',
        modules_watched: []
    }
    const newUser = new Users(user)
    const result =  await newUser.save()
    return result
})

module.exports = router;