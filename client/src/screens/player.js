import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router'
import styles from '../styles/player.module.css'

const Player = () => {
  const { topic, id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null)
  const [next, setNext] = useState(false)
  const location = useLocation();
  const { topic_id, video_id, completeStatus } = location.state;

  const fetchVideo = async () => {
    try {
      const res = await axios.post('http://localhost:8000/video/get-topic-video', {
        topic_id: topic_id, // id from state
        video_id: video_id, // video id from params
      });
      if (res.status === 200 && res.data) {
        setVideo(res.data.videos);
      }
    } catch (err) {
      console.error('Error fetching video:', err);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  useEffect(() => {
    if (video && !playerRef.current && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        autoplay: false,
        controls: true,
        preload: 'auto',
        loop: false,
        muted: false,
        // poster: 'https://thumbor.forbes.com/thumbor/fit-in/1290x/https://www.forbes.com/advisor/wp-content/uploads/2023/11/shih-tzu-temperament.jpeg.jpg',
        playbackRates: [0.5, 1, 1.5, 2],
        bigPlayButton: true,
        controlBar: {
          children: ['playToggle', 'volumePanel', 'fullscreenToggle', 'progressControl'],
        },
      })

      playerRef.current.on('ended', () => {
        storeProgress()
        prepareNext()
      });
    }

    if (video && playerRef.current) {
      playerRef.current.src({
        src: video[id-1].video_URL,
        type: 'video/mp4',
      });
    }
  }, [video,fetchVideo])

  const prepareNext = () => {
    if (id >= video.length) return;
    setNext(true);
  };

  const PlayNext = () => {
    navigate(`/${topic}/${Number(id) + 1}`, {
      state: {
        topic_id: topic_id,
        video_id: video[id]._id,
        completeStatus: completeStatus
      },
    });
    window.location.reload();
  }

  const userID = window.localStorage.getItem('userID')

  const storeProgress = async()=>{
    await axios.post('http://localhost:8000/user/store-progress',{
      topic: topic,
      topic_id: topic_id,
      video_id: video[id-1]._id,
      user_ID: userID,
      progress: 'completed'
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {video && <div className={styles.progress}>{id}/{video.length}</div>}
        {video && completeStatus && <div className={styles.percentage}>{Math.floor((Number(completeStatus)/video.length)*100)}%</div>}
      </div>
      {video &&
        <div data-vjs-player className={styles.videoPlayer} style={{height: '500px',width: '600px'}}>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
      }
      {next && <button className={styles.button} onClick={PlayNext}>NEXT VIDEO</button>}
      {video && Number(id) === video.length && (
        <div className={styles.endMessage}>
          <h3 onClick={()=>navigate('/dashboard',{ replace: true })} className={styles.button}>Back to HOME</h3>
        </div>
      )}
    </div>
  );
};

export default Player;