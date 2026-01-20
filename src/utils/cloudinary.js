import { response } from "express"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    //putting random values for learning but since all these are private confidential details so we will move it to .env file
    // cloud_name : "annyclouds",
    // api_key: "234823748979",
    // api_secret:'2323232323232323232323'
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //else upload file on cloudinary
        await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })
        //file uploaded successfully
        console.log("File is uploaded on cloudinary", response.url)
        return response
    }
    catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operationgot failed
        return null
    }
}

export { uploadOnCloudinary }