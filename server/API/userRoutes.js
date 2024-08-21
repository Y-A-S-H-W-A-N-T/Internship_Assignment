const express = require('express');
const router = express.Router();

router.post('/test',async(req,res)=>{
    console.log("DATA : ",req.body)
})

module.exports = router;