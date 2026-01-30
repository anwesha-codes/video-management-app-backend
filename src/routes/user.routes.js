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

export default router 