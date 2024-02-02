import express from "express";
import user from "../controllers/UserController.js";
import CheckAccessToken from "../middlewares/CheckAccessToken.js";
import CheckRefreshToken from "../middlewares/CheckRefreshToken.js";

const router = express.Router();

router.post('/auth/signup', user.signup);
router.post('/auth/login', user.login);
router.get('/auth/refresh', CheckRefreshToken, user.refresh);
router.delete('/auth/logout', CheckRefreshToken, user.logout);
router.get("/users", CheckAccessToken, user.index);
router.get("/users/:id", user.show);
router.put("/users/:id", user.update);
router.delete("/users/:id", user.delete);

export default router


