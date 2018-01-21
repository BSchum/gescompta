const router = require('express').Router();
const jwt = require('jsonwebtoken');
router.use('/private',function(req, res, next){
  if(req.headers.authorization && req.headers.authorization.split(' ')[0] === "JWT"){
    jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
      if(decode){
        req.body.user = decode;
        next();
      }else{
        return res.status(401).json({message: 'Unauthorized user'});
      }
    });
  }else{
    return res.status(401).json({message: 'No jwt token'});
  }
});
router.use('/public', require('./public'));
router.use('/private', require('./private'));

module.exports = router;
