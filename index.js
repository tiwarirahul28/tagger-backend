import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/taggerDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    password: String
})

const User = new mongoose.model(" User ", userSchema)

// Thirdperson userschems
const thirdSchema = new mongoose.Schema({
    name: String,
    number: String,
    email: String,
    message: String,
    formId: String
})

const ThirdUser = mongoose.model("ThirdUser", thirdSchema)
app.post('/user', (req, res) => {
    const {name, number, email, message, formId} = req.body
    const tuser = new ThirdUser({
        name,
        number,
        email,
        message,
        formId
    })
    tuser.save(err => {
        if(err) {
            res.send(err)
        } else {
            res.send( { message: "Messege send" })
        }
    })
})

app.post('/signin', (req, res) => {
    const { number, password } = req.body
    User.findOne({number: number}, (err, user) => {
        if(user){
            if(password === user.password){
                res.send({message: "Login successfull", user: user})
            }
            else{
                res.send({message: "password didn't match"})
            }
        }else{
            res.send({message: "User not registered"})
        }
    })
})

app.post('/signup', (req, res) => {
    const { name, number, password} = req.body
    User.findOne({number: number}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                name, 
                number, 
                password
            })
            user.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
})

app.listen(8000, () => {
    console.log("Be started at port 8000")
})

// fetching thirdperson data for specific user
app.get('/getalluser', async(req, res) => {
    try{
        const alldata = await ThirdUser.find({});
        res.send({status:"ok", data: alldata})
    }
    catch(error){
        console.log(error)
    }
})