const express = require('express');
const userCtrl = require('./users.controller');
const router = express.Router();

router.get('/getUser', userCtrl.getUser);
router.get('/getUsers', userCtrl.getAllUser);
router.post('/createUser', userCtrl.createUser);
router.put('/updateUser', userCtrl.updateUser);
router.delete('/deleteUser', userCtrl.deleteUser);
router.post('/login', userCtrl.loginUser);
module.exports = router;
