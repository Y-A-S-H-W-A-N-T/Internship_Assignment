import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios'
import styles from '../styles/topic.module.css'

function Topic() {
  const location = useLocation();
  const [course, setCourse] = useState(location.state.Topic);
  const [resumeLink, setResumeLink] = useState(null);
  const userID = window.localStorage.getItem('userID')
  const [loading,setLoading] = useState(true)

  const [completedVideos,setCompletedVideos] = useState(0)
  const [resumeDuration,setResumeDuration] = useState()

  const fetchModuleProgress = async () => {
    try {
      // Fetch the module progress for the user
      const res = await axios.post('https://coursestream.onrender.com/user/get-module-progress', {
        topic_id: course._id,
        user_ID: userID,
      });
      
      if (res.status === 200 && res.data) {
        const completedVideos = res.data.completed_videos; // Array of video completed by the user
        setResumeDuration(res.data.last_video_duration) // to be resumed video duration

        const completedVideoIds = completedVideos.map(video => video.video_id)
        setCompletedVideos(completedVideoIds) // stroring IDs of completed videos

        const index = course.videos.findIndex(video => !completedVideoIds.includes(video._id))

        // store/pass index (ID) for displaying the resumed video

        //resumelink contains the link to the resume video, It is a Dynamic Link

        if (index !== -1) {
          setResumeLink(`/${course.topic_name}/${res.data.video_number || res.data.completed_videos.length+1}`);
        } else {
          setResumeLink('completed')
        }
        setLoading(false)
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResumeLink('not-started');
      } else {
        console.error('Error fetching module progress:', err);
      }
    }
    setLoading(false)
  };

  useEffect(() => {
    fetchModuleProgress();
  }, [course]);

  return (
    <div className={styles.container}>
      {course && <h1 className={styles.topicTitle}>{course.topic_name}</h1>}
      
      {/* showing progress of the course */}

      {completedVideos.length>0 ? (
        <div className={styles.progressContainer}>
          <h2 className={styles.progressText}>Videos Watched{completedVideos.length}/{course.videos.length}</h2>
          <h2 className={styles.progressText}>{Math.floor((completedVideos.length/course.videos.length)*100)}% Completed</h2>
        </div>
      )
      :
        <div className={styles.progressContainer}>
            <h2 className={styles.progressText}>Videos Watched 0/{course.videos.length}</h2>
            <h2 className={styles.progressText}>0 % Completed</h2>
          </div>
      }
      
      {/*display whether to Start from begining, resume course or the course is completed according to data comming from user's DB */}
      {loading && <div>
        <h2>Loading...</h2>
      </div>}

      {course && (
        <div>
          <Link
            to={`/${course.topic_name}/1`}
            state={{ topic_id: course._id,
              completeStatus: completedVideos.length,
              totalVideos: course.videos.length,
              time_duration: 0
            }}
            className={styles.linkButton}
          >
            Start Tutorial From Start
          </Link>
          {resumeLink === 'not-started' ? (
            <></>
          ) : (
            resumeLink === 'completed' ? (
              <h3 className={styles.completedMessage}>This Course is Completed</h3>
            ) : resumeLink && (
              <Link
                to={resumeLink}
                state={{ 
                  topic_id: course._id,
                  completeStatus: completedVideos.length,
                  time_duration: resumeDuration || 0,
                  totalVideos: course.videos.length,
                }}
                className={styles.linkButton}
              >
                Resume Tutorial
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Topic;