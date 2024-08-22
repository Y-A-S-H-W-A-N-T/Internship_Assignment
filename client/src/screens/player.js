import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router';

const Player = () => {
  const { topic, id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null)
  const [next, setNext] = useState(false)
  const location = useLocation();
  const { topic_id, video_id } = location.state;

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
      });

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
      },
    });
    window.location.reload();
  }

  const storeProgress = async()=>{
    alert("Store Video Progress")
  }

  return (
    <div>
      {video && (
        <div data-vjs-player style={{ width: '200px', height: '200px' }}>
          <video ref={videoRef} className="video-js vjs-big-play-centered" />
        </div>
      )}
      {next && <button onClick={PlayNext}>NEXT VIDEO -{'>'}</button>}
      {video && Number(id) === video.length? <h2>End of The Course</h2> : ''}
    </div>
  );
};

export default Player;