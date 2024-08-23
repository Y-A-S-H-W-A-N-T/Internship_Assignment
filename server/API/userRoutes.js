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
    const { user_ID, topic_id, video_id, duration, topic, video_duration } = req.body;
    try {
        const user = await Users.findById(user_ID);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Find the module
        let module = user.modules_watched.find(m => m.module_id === topic_id);

        if (module) {
            console.log("asdadasdasdddasad========================================== : ",module)
            let video = module.module_videos.find(v => v.video_id === video_id);
            console.log(video)
            if (video) {
                // Update the video progress
                video.duration = duration;
                video.video_duration = video_duration
                console.log("Video progress updated")
                await user.save()
                return
            } else {
                // Add new video if not found
                module.module_videos.push({ video_id: video_id, duration: duration, video_duration: video_duration});
                console.log("Video Added");
                await user.save()
                return
            }
        } else {
            user.modules_watched.push({
                module_id: topic_id,
                module_name: topic,
                module_videos: [{ video_id: video_id, duration: duration, video_duration: video_duration}]
            });
            await user.save();
            console.log("Module Added");
            return
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/get-module-progress', async (req, res) => {
    const { topic_id, user_ID } = req.body;
    try {
        const user = await Users.findById(user_ID);
        if (!user) {
            return res.status(404).json({ msg: 'User Not Found' });
        }

        const module = user.modules_watched.find(m => m.module_id === topic_id);
        if (module) {
            const module_videos = module.module_videos;

            // Separate completed and pending videos
            const completed_videos = module_videos.filter(v => v.duration === v.video_duration) // if it contains all videos, the course is over
            
            let last_video_duration = null
            let video_number = null

            for (let i = 0; i <= module_videos.length-1; i++) {
                const video = module_videos[i];
                if (video.duration !== video.video_duration) {
                    last_video_duration = video.duration
                    video_number = i+1
                    break;
                }
            }

            const response = {
                completed_videos: completed_videos,
                last_video_duration: last_video_duration,
                video_number: video_number
            };

            return res.status(200).json(response);
        } else {
            return res.status(404).json({ msg: 'Module Not Found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/get-user',async(req,res)=>{
    try{
        const user = await Users.findById(req.body.id)
        res.status(200).send(user)
    }
    catch(err){
        console.log(err)
    }
})

// Dev APIs

router.post('/add-user', async (req,res) => {
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