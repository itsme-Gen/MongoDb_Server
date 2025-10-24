const express = require('express')
const cors = require('cors')
const dbconn = require('../MongoDb/db_connection')
const mongoose = require('mongoose')
const User = require('../Models/User')
dbconn()
const app = express()
app.use(express.json())
app.use(cors())


app.get("/employee/:id",async(req,res)=>{
    const id = req.params.id

    try{

        const fetchUser = await User.findOne({ _id:id})

        if(!fetchUser){
            console.log("User Not found")
            res.status(201).json({success:false, message:"User not found"})
        }

        console.log("User found",fetchUser)
        res.status(200).json({success:true,message:"User Found!",user:fetchUser})
        

    }catch(error){
        console.error("Error",error)
        res.status(500).json({success:false, message:"Server Error"})
    }
})

app.listen(9000,()=>{
    console.log("Server is running to port 9000")
})