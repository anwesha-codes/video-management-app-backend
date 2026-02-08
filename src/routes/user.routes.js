import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(upload.fields([
    {
        name: "avatar", // remember this name "avatar" has to be exactly same in frontend 
        maxCount: 1
    },
    {
        name: "coverImage", // remember this name "coverImage" has to be exactly same when send from frontend
        maxCount: 1
    }
]),
    registerUser)


router.route("/login").post(loginUser)

//secure routes - logout
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-access-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)
export default router 