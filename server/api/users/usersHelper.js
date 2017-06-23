const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('../../configs')[env];

const findOneUser = (query, projection)=>{
  return new Promise((resolve, reject)=>{
    User.findOne(query, projection, (err, response)=>{
      if(err){
        reject(err);
      }else{
        resolve(response);
      }
    });
  });
}

const findUser = (query, projection)=>{
  return new Promise((resolve, reject)=>{
    User.find(query, projection, (err, response)=>{
      if(err){
        reject(err);
      }else{
        resolve(response);
      }
    });
  });
}

const createUser = (saveObj)=>{
  return new Promise((resolve, reject)=>{
    let user = new User(saveObj);
    user.save(saveObj, (err, response)=>{
      if(err){
        reject(err);
      }else{
        resolve(response);
      }
    });
  });
}

const updateUser = (query, updateObj, options)=>{
  return new Promise((resolve, reject)=>{
    User.update(query, updateObj, options, (err, response)=>{
      if(err){
        reject(err);
      }else{
        resolve(response);
      }
    });
  });
}

const deleteUser = (removeQuery)=>{
  return new Promise((resolve, reject)=>{
    User.remove(removeQuery, (err, response)=>{
      if(err){
        reject(err);
      }else{
        resolve(response);
      }
    });
  });
}

const getAuthToken = (userInfo)=>{
  return new Promise(resolve=>{
    let jwtSignData = {
      id: userInfo._id,
      email: userInfo.email
    };


    let jwtSignOptions = {
      expiresIn: config.jwtAuth.expireTime,
      algorithm: config.jwtAuth.algorithm
    };

    let token = jwt.sign(jwtSignData, config.jwtAuth.secretKey, jwtSignOptions);
    resolve(token);
  });
}

module.exports = {
  findOneUser,
  findUser,
  createUser,
  updateUser,
  deleteUser,
  getAuthToken
};
