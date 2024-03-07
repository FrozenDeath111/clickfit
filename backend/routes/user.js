const express = require("express");
const {
    createUser,
    getUser
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUser);
router.post("/create", createUser);

module.exports = router;