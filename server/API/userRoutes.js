const express = require('express');
const router = express.Router();
const { Users } = require('../Schema/userSchema');
const { Videos } = require('../Schema/videoSchema');


router.post('/login',async(req,res)=>{
    let user = null
    user = await Users.findOne(req.body)
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
            let video = module.module_videos.find(v => v.video_id === video_id);
            if (video) {
                // Update the video progress
                video.duration = duration;
                video.video_duration = video_duration
                await user.save()
                return
            } else {
                // Add new video if not found
                module.module_videos.push({ video_id: video_id, duration: duration, video_duration: video_duration});
                await user.save()
                return
            }
        } else {
            // add new module when user clicks and starts the course, store progress only if the user watches the video
            const total_videos_in_topic = await Videos.findById(topic_id)
            const length = total_videos_in_topic.videos.length
            user.modules_watched.push({
                module_id: topic_id,
                module_name: topic,
                module_videos: [{ video_id: video_id, duration: duration, video_duration: video_duration}],
                total_module_video: length
            });
            await user.save();
            return
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/get-module-progress', async (req, res) => {
    // fetching the progress of a particular module
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

            for (let i = 0; i <= module_videos.length-1; i++) { // search for recent pending video
                const video = module_videos[i];
                if (video.duration !== video.video_duration) { // if duration != video duration, it is not fully completed, resume that video
                    last_video_duration = video.duration
                    video_number = i+1
                    break;
                }
            }

            // send pending video number and the resume duration, send if no pending video exists

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

router.post('/get-user', async (req,res) => {
    try{
        const user = await Users.findById(req.body.id)
        const totalVideos = user.modules_watched.map(vid =>{
            return vid.module_videos.filter(v => v.duration === v.video_duration)
        })
        res.status(200).json({data: user, CompletedVideos: totalVideos})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/get-user-progress', async (req,res) => {

    const { topic_id, userID } = req.body
    try{
        const user = await Users.findById(userID)
        const Module = user.modules_watched.find(m => m.module_id === topic_id)
        const progress = Module?.module_videos.filter(v => v.duration === v.video_duration)
        res.status(200).json({Progress: progress? progress.length : 0})
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