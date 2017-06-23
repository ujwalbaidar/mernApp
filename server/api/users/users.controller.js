const usersHelper = require('./usersHelper');
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const config = require('../../configs')[env];
const crypto = require('crypto');

const getUser = (req, res)=>{
  let query = req.query;
  usersHelper.findOneUser(query, {_id:0, password: 0 })
    .then(user=>{
      res.status(200).json({ success: true, data: user, msg: 'Data retrieved successfully!' });
    })
    .catch(userErr=>{
      res.status(400).json({ success: false, data: userErr, msg: 'Failed to findUser' });
    });
}

const getAllUser = (req, res)=>{
  let query = req.query;
  usersHelper.findUser(req.query, { _id:0, password: 0 })
    .then(users=>{
      res.status(200).json({ success: true, data: users, msg: 'All Data retrieved successfully!' });
    })
    .catch(userErr=>{
      res.status(400).json({ success: false, data: userErr, msg: 'Failed to findUser' });
    });
}

const createUser = (req, res)=>{
  req.body.password = crypto.createHmac(config.loginPassword.algorithm, config.loginPassword.secretKey)
                   .update(req.body.password)
                   .digest('hex');
  usersHelper.createUser(req.body)
    .then(saveResponse=>{
      res.status(200).json({ success: true, data: saveResponse, msg: 'Data created successfully!' });
    })
    .catch(saveErr=>{
      var msg = '';
      if(saveErr.name && saveErr.name === 'ValidationError'){
        msg = saveErr._message;
      }else if (saveErr.code == 11000) {
        msg = 'Duplicate Entry';
      }else{
        msg = 'Faild to createUser';
      }
      res.status(400).json({ success: false, data: saveErr, msg: msg });
    });
}

const updateUser = (req, res)=>{
  if(JSON.stringify(req.query) !== '{}'){
    let query = req.query;
    let updateObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      telephone: req.body.telephone,
      status: req.body.status,
      updatedDate: new Date()
    };

    usersHelper.updateUser(query, updateObj)
      .then(updateResponse=>{
        res.status(200).json({ success: true, data: updateResponse, msg: 'Data updated successfully!' });
      })
      .catch(updateErr=>{
        var msg = '';
        if(updateErr.code === 11000){
          msg = 'Duplicate Entry!';
        }else {
          msg = 'Failed to update requested data!';
        }
        res.status(400).json({ success: false, data: updateErr, msg: msg });
      });
  }else{
    res.status(400).json({ success: false, data: '', msg: 'Query Field to update data cannot be empty!' });
  }
}

const deleteUser = (req, res)=>{
  if(JSON.stringify(req.query) !== '{}'){
    let query = req.query;
    usersHelper.deleteUser(query)
      .then(updateResponse=>{
        res.status(200).json({ success: true, data: updateResponse, msg: 'User Deleted successfully!' });
      })
      .catch(deleteErr=>{
        res.status(400).json({ success: false, data: deleteErr });
      });
  }else{
    res.status(400).json({ success: false, data: '', msg: 'Query Field to delete data cannot be empty!' });
  }
}

const loginUser = (req, res)=>{
  if(req.body.email !== undefined && req.body.password !== undefined){
    usersHelper.findOneUser({email: req.body.email})
      .then(user=>{
        if(user && JSON.stringify(user) !== '{}'){
          let password = crypto.createHmac(config.loginPassword.algorithm, config.loginPassword.secretKey)
                          .update(req.body.password)
                          .digest('hex');
          if(password === user.password){
            usersHelper.getAuthToken(user)
              .then(authToken=>{
                res.status(200).json({ success: true, data: authToken, msg: 'User logged in successfully!' });
              });
          }else{
            res.status(200).json({ success: false, data: 'passwordErr', msg: 'Password not matched' });
          }
        }else{
          res.status(200).json({ success: false, data: 'emailErr', msg: 'Email does not exist!' });
        }
      })
  }else{
    res.status(400).json({ success: false, data: '', msg: 'Email or Password field is missing!' });
  }
}

module.exports =   {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};
