import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function Topic() {
  const location = useLocation();
  const [course, setCourse] = useState(location.state.Topic);
  const [resumeLink, setResumeLink] = useState(null);
  const userID = window.localStorage.getItem('userID');
  const [nextVideoIndex, setNextVideoIndex] = useState(null);

  const fetchModuleProgress = async () => {
    try {
      // Fetch the module progress for the user
      const res = await axios.post('http://localhost:8000/user/get-module-progress', {
        topic_id: course._id,
        user_ID: userID,
      });
      
      if (res.status === 200 && res.data) {
        const completedVideos = res.data.completed_videos; // Array of video IDs completed by the user
        const completedVideoIds = completedVideos.map(video => video.video_id);

        // Find the index of the first incomplete video
        const index = course.videos.findIndex(video => !completedVideoIds.includes(video._id));
        setNextVideoIndex(index);

        if (index !== -1) {
          // Generate the resume link for the next incomplete video
          setResumeLink(`/${course.topic_name}/${course.videos[index].video_number}`);
        } else {
          // If all videos are completed, handle accordingly
          setResumeLink('completed'); // or set a message for all videos completed
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
    <div>
      {course && <h1>PLAY VIDEO OF THE TOPIC {course.topic_name}</h1>}
      {course && (
        <div>
          <h2>
            <Link
              to={`/${course.topic_name}/${course.videos[0].video_number}`}
              state={{ topic_id: course._id, video_id: course.videos[0]._id }}
            >
              Start Tutorial From Start
            </Link>
          </h2>
          {resumeLink === 'not-started' ? (
            <></>
          ) : 
          (
            resumeLink === 'completed' ? (
              <h3>
                This Course is Completed
              </h3>
            )
            :
            (
              <Link to={resumeLink} state={{ topic_id: course._id, video_id: course.videos[nextVideoIndex]?._id }}>
                Resume Tutorial
              </Link>
            )
          )
          }
        </div>
      )}
    </div>
  );
}

export default Topic;