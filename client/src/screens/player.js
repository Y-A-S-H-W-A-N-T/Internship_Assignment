import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router'
import styles from '../styles/player.module.css'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import VIDEOS from '../component/logos/videos.png'

const Player = () => {
  const { topic, id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null)
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null)
  const [next, setNext] = useState(false)
  const location = useLocation();
  const { topic_id, completeStatus, totalVideos, time_duration } = location.state || '';

  const userID = window.localStorage.getItem('userID')

  const fetchVideo = async () => { // fetching the particular video from the module
    try {
      const res = await axios.post('https://coursestream.onrender.com/video/get-topic-video', {
        topic_id: topic_id,
        video_number: id
      });
      if (res.status === 200 && res.data) {
        setVideo(res.data.video)
      }
    } catch (err) {
      console.error('Error fetching video:', err);
    }
  };

  const [progress,setProgress] = useState()

  const fetch_User_Progress = async()=>{
    await axios.post('https://coursestream.onrender.com/user/get-user-progress',{ // fetch
      userID: userID,
      topic_id: topic_id
    })
    .then((res)=>{
      if(res.status === 200){
        setProgress(res.data.Progress)
      }
      else console.log("Error in setting Progress")
    })
  }

  useEffect(() => {
    fetchVideo()
    fetch_User_Progress()
  },[id,topic]);

  useEffect(() => {
    if (video && !playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        preload: 'auto',
        loop: false,
        muted: false,
        playbackRates: [0.5, 1, 1.5, 2],
        bigPlayButton: true,
        controlBar: {
          children: ['playToggle', 'volumePanel', 'fullscreenToggle','remainingTimeDisplay'],
        },
      })
      // restricting user from fast forwarding, showing remaining time in the video

      playerRef.current.on('loadedmetadata', () => {
        playerRef.current.currentTime(time_duration) // watched seconds in the video
      });

      playerRef.current.on('ended', () => {
        prepareNext()
      })

      playerRef.current.on('pause', () => {
        const currentTime = playerRef.current.currentTime()
        storeProgress(currentTime)
      });
    }

    if (video && playerRef.current) {
      playerRef.current.src({
        src: video.video_URL,
        type: 'video/mp4',
      });
    }

  }, [video,fetchVideo ])

  const prepareNext = () => {
    if (Number(id) >= totalVideos){ // setup the next video to be played
      return;
    }
    setNext(true)
  };

  const PlayNext = () => {
    navigate(`/${topic}/${Number(id) + 1}`, {
      state: {
        topic_id: topic_id,
        completeStatus: completeStatus, //fetch completed status
        totalVideos: totalVideos,
        time_duration: 0
      }
    });
    window.location.reload();
  }

  const storeProgress = async(currentTime = null)=>{ // store progress of the video at each intervals
    await axios.post('https://coursestream.onrender.com/user/store-progress',{
      topic: topic,
      topic_id: topic_id,
      video_id: video?._id,
      user_ID: userID,
      duration: currentTime,
      video_duration: video?.video_duration // this is used for resuming the video from where he last left
    })
  }

  return (
    <div className={styles.container}>

      {/* displaying user's progress in that particular module */}

        <div className={styles.header}>
          <div className={styles.progress}><img src={VIDEOS} height={20} width={20}/> {id}/{totalVideos}</div>
          <div className={styles.percentage}>
            <CircularProgressbar 
                      value={ (progress/totalVideos) * 100 } 
                      text={ `${Math.round(progress/totalVideos * 100)} % ` } 
            />
          </div>
        </div>

      {/* Displaying video using VideoJS */}

      {video &&
        <div data-vjs-player className={styles.videoPlayer} style={{height: '500px',width: '600px'}}>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
      }
      {next && Number(id) !== totalVideos && <button className={styles.button} onClick={PlayNext}>NEXT VIDEO</button>}

      {/* displaying end of the course or last video of the course */}

      {video && Number(id) === totalVideos && (
        <div className={styles.endMessage}>
          <h3 onClick={()=>navigate('/dashboard',{ replace: true })} className={styles.button}>Back to HOME</h3>
        </div>
      )}
    </div>
  );
};

export default Player;