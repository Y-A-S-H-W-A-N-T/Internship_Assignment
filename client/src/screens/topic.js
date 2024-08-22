import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios'
import styles from '../styles/topic.module.css'

function Topic() {
  const location = useLocation();
  const [course, setCourse] = useState(location.state.Topic);
  const [resumeLink, setResumeLink] = useState(null);
  const userID = window.localStorage.getItem('userID');
  const [nextVideoIndex, setNextVideoIndex] = useState(null);

  const [completedVideos,setCompletedVideos] = useState(0)

  const fetchModuleProgress = async () => {
    try {
      // Fetch the module progress for the user
      const res = await axios.post('http://localhost:8000/user/get-module-progress', {
        topic_id: course._id,
        user_ID: userID,
      });
      
      if (res.status === 200 && res.data) {
        const completedVideos = res.data.completed_videos; // Array of video IDs completed by the user
        const completedVideoIds = completedVideos.map(video => video.video_id)
        setCompletedVideos(completedVideoIds)

        // Find the index of the first incomplete video
        const index = course.videos.findIndex(video => !completedVideoIds.includes(video._id));
        setNextVideoIndex(index);

        if (index !== -1) {
          // Generate the resume link for the next incomplete video
          setResumeLink(`/${course.topic_name}/${course.videos[index].video_number}`);
        } else {
          setResumeLink('completed')
        }
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResumeLink('not-started');
      } else {
        console.error('Error fetching module progress:', err);
      }
    }
  };

  useEffect(() => {
    fetchModuleProgress();
  }, [course]);

  return (
    <div className={styles.container}>
      {course && <h1 className={styles.topicTitle}>{course.topic_name}</h1>}
      
      {completedVideos.length && (
        <div className={styles.progressContainer}>
          <h2 className={styles.progressText}>Videos Watched{completedVideos.length}/{course.videos.length}</h2>
          <h2 className={styles.progressText}>{Math.floor((completedVideos.length/course.videos.length)*100)}% Completed</h2>
        </div>
      )}
      
      {course && (
        <div>
          <Link
            to={`/${course.topic_name}/${course.videos[0].video_number}`}
            state={{ topic_id: course._id, video_id: course.videos[0]._id, completeStatus: completedVideos.length }}
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
                state={{ topic_id: course._id, video_id: course.videos[nextVideoIndex]?._id, completeStatus: completedVideos.length }}
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