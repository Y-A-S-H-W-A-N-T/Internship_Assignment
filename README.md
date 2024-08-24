# ( CourseStream ) VideoJS Playback Project

A web application for seamless video playback, offering features such as progress tracking, resume functionality, and easy navigation between videos. Designed to enhance the learning experience with video content.
  ****
## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
 ****

## Project Overview

The VideoJS Playback Project provides a robust video playback solution with features tailored for a seamless learning experience. Users can track their progress, resume playback from where they left off, and navigate through a sequence of videos effortlessly. The application is built with modern technologies to ensure a smooth and responsive user experience.
  ****
## Deployment
- **Hosted Link**: [CourseStream](https://coursestream.vercel.
 ****

## Features

- **Video Playback**: Watch videos with standard controls for play, pause, and seek.
- **Progress Tracking**: Automatically save and update video progress.
- **Resume Functionality**: Resume videos from the exact point where the user paused.
- **Sequential Navigation**: Navigate between videos in a playlist or course ( only previous videos ).
- **Video Metadata**: Display information such as title, description, and duration.
- **User Progress**: Track user progress, videos watched etc.
  ****
## Technologies Used

- **Frontend**:
  - **React**: For building the user interface.
  - **Video.js**: A powerful video player library.
  - **CSS**: For utility-first CSS styling.
  - **React npm Packages**: For components like progress bar, icons.
- **Backend**:
  - **Node.js**: JavaScript runtime for the server-side logic.
  - **Express**: Web framework for Node.js. Using Microservice Architecture.
  - **MongoDB**: NoSQL database for storing video progress and user data.
  - **Mongoose**: ODM library for MongoDB.
- **Deployment**:
  - **Vercel**: Hosting for the frontend.
  - **Render.com**: Hosting for the backend.
  ****

  ## Environment Variable

  **MONGOOSE_URL** = mongodb+srv://raoyashwant132:Xchange@mobile.qd2x1vb.mongodb.net/Internship?retryWrites=true&w=majority&appName=Mobile
    ****

  ## Walk Through
    ****

    1. Login using any of the user, you can change the user by click on user1/user2/user3.
    2. You will be taken to the Dashboard
    3. Dashboard contains search bar, profile and all the courses/modules and its videos.
    4. Navigate/click the profile i.e round button on the top right. This button takes you to user's profile.
    5. User's profile contains, user data, Modules completed or pending by the user, videos completed in each module etc.
    6. For watching a module, navigate to dash and select/search a course.
    7. The course showcase total videos, watched videos, completed videos.
    8. After the course is started, user can only pause, mute, adjust volume and screen.
    9. He can not fast forward a video, but can navigate back and rewatch the previous video
    10. The progress gets stored at each interval, so that when the user returns, he can resume from where he left.
     ****

  ## API Endpoints
  Microservice Architecture
  ****
  **userRoutes :**
  - **/login** - `logs in user`
  - **/store-progress** - `stores progress of the user in the module. eg: duration`
  - **/get-module-progress** - `fetches module progress for continuing/resuming unfinished modules/videos`
  - **/get-user** - `fetches user 
  - **/get-user-progress** - `fetches user progress, i.e completed modules and videos by user`
  - **/add-user** - `DEV API, for uploading user data.`
  ****
  **videoRoutes :**
    - **/get-videos** - `fetches all modules and its videos`
    - **/get-topic-video** - `fetches videos from a certain topic by using the topic id`
    - **/postVideos** - `DEV API, for uploading modules and videos`
