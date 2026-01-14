import mongoose from 'mongoose'

 const connectDB= async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:"Chatty"
        })
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}


export default connectDB
