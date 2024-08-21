import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router'
import { Videos } from '../component/videos.js'
import { Link } from 'react-router-dom'
import axios from 'axios'


function Topic() {

    const location = useLocation()

    const [course,setCourse] = useState(location.state.Topic)

  const to_be_resumed_index = 0

  return (
    <div>
        {course && <h1>PLAY VIDEO OF THE TOPIC {course.topic_name}</h1>}
        {course && <div>
          <h2><Link to={`/${course.topic_name}/${course.videos[0].video_number}`} state={{topic_id: course._id, video_id: course.videos[0]._id}}>Start Tutorial From Start (send first video for playing)</Link></h2>
          <Link to={`/${course.topic_name}/${course.videos[to_be_resumed_index]._id}`}>Resume Tutorial (fetch the progress/completed status and send for playing)</Link>
        </div>}
    </div>
  )
}

export default Topic