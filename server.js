import app from './app.js'
import cloudinary from 'cloudinary'

app.listen(process.env.PORT,()=>{
    console.log(`Port is listening on ${process.env.PORT}`);
}) 

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_key,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

