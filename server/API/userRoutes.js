const express = require('express');
const router = express.Router();
const { Users } = require('../Schema/userSchema')

router.post('/test',async(req,res)=>{
    console.log("DATA : ",req.body)
})


router.post('/login',async(req,res)=>{
    let user = null
    user = await Users.findOne(req.body)
    console.log(user)
    if (user === null) {
        return res.status(404).json({ msg: 'User Not Found' });
    }
    return res.status(200).send(user);
})



// Dev APIs

router.post('/addUser',async(req,res)=>{
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