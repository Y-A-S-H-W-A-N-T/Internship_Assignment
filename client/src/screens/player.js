import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router'
import styles from '../styles/player.module.css'

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

  const fetchVideo = async () => {
    try {
      const res = await axios.post('http://localhost:8000/video/get-topic-video', {
        topic_id: topic_id,
        video_number: id
      });
      if (res.status === 200 && res.data) {
        console.log(res.data)
        setVideo(res.data.video)
      }
    } catch (err) {
      console.error('Error fetching video:', err);
    }
  };

  const [progress,setProgress] = useState()

  const fetch_User_Progress = async()=>{
    await axios.post('http://localhost:8000/user/get-user-progress',{
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
          children: ['playToggle', 'volumePanel', 'fullscreenToggle'],
        },
      })

      playerRef.current.on('loadedmetadata', () => {
        playerRef.current.currentTime(time_duration);
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
    if (Number(id) >= totalVideos){
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

  const storeProgress = async(currentTime = null)=>{
    console.log("called")
    await axios.post('http://localhost:8000/user/store-progress',{
      topic: topic,
      topic_id: topic_id,
      video_id: video?._id,
      user_ID: userID,
      duration: currentTime,
      video_duration: video?.video_duration
    })
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.progress}>{id}/{totalVideos}</div>
          <div className={styles.percentage}>{completeStatus>0 ? Math.floor((progress/totalVideos)*100) : '0'} %</div>
        </div>
      {video &&
        <div data-vjs-player className={styles.videoPlayer} style={{height: '500px',width: '600px'}}>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
      }
      {next && Number(id) !== totalVideos && <button className={styles.button} onClick={PlayNext}>NEXT VIDEO</button>}
      {video && Number(id) === totalVideos && (
        <div className={styles.endMessage}>
          <h3 onClick={()=>navigate('/dashboard',{ replace: true })} className={styles.button}>Back to HOME</h3>
        </div>
      )}
    </div>
  );
};

export default Player;