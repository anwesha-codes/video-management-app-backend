import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({ message: "all ok boss" })

    // 1. get user details from frontend
    const { fullName, email, userName, password } = req.body
    console.log("email is:", email)

    // 2. validate that user fields are not empty   
    if ([fullName, userName, email, password].some((field) => { return field.trim() === "" })) {
        throw new apiError(400, "All fields are required")
    }

    // 3. check if user already exists
    const existingUser = User.findOne({
        $or: [{ userName }, { email }]
    })
    if (existingUser) {
        throw new apiError(409, "User already exists with email or username")
    }

    // 4. check avatar and cover images [REMEMBER THIS "avatar" & "coverImage" name should be exactly same as one we pass in user.routes.js]
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    // 5. upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const cover = await uploadOnCloudinary(coverLocalPath)
    if (!avatar) {
        throw new apiError(400, "Both avatar is required")
    }

    // 6. create user object in DB
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    // 7. & 8. check if user is created and also remove password and refreshToken
    const createdUser = User.findById(user._id).select(
        "-password -refreshToken" // syntax: we put '-' before all the fields that we don't want like password and refreshToken. Also, both these fields will be under a single string as comma-separated values
    )
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering user")
    }

    // 9. return the response
    return res.status(201).json(
        new apiResponse(200, createdUser, "user created successfully")
    )
})

export { registerUser }