const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User')
const {SECRET_KEY} = require('../../config');

const {UserInputError} = require("apollo-server")
const { validateRegisterInput , validateLoginInput} = require('../../util/validator')

function generatetoken(user){
   return jwt.sign({
        id: user.id,
        email:user.email,
        username : user.username
    }, SECRET_KEY ,{expiresIn: '1h'});


}

module.exports = {
  Mutation :{

      async login(_,{username,password}){
        const {valid,errors} = validateLoginInput(username ,password);

        if(!valid){
            throw new UserInputError('Errors',{ errors });
        }


        const user = await User.findOne({username});
        if(!user){
           errors.general = "User not found"; 
           throw new UserInputError('User not found', {errors})
        }

        const match = await bcrypt.compare(password,user.password);
        if(!match){
            errors.general = "Wrong credentails"; 
            throw new UserInputError('Wrong credentails', {errors})
         
        }
        const token = generatetoken(user)
        return {
            ...user._doc,
            id:user._id,
            token
        }
   
       
      },
      async register(_,{registerInput : {username , email, password ,confirmPassword}},context,info){
           //todo validate user data 
                const {valid,errors} = validateRegisterInput(username , email, password ,confirmPassword);
                if(!valid){
                    throw new UserInputError('Errors',{ errors });
                }

           // make sure user doesn't already exisits
             const user = await User.findOne({username});
             if(user){
                 throw new UserInputError('Username is taken',{
                   errors : {
                       username : 'This username is taken '
                   }  
                 })
             }

           //hash the password and auth token 
           password = await bcrypt.hash(password , 12);

           const newUser = new User({
               email,
               username,
               password,
               createdAt:new Date().toISOString()
           });

           const res = await newUser.save();

           const token =generatetoken(res);
           return {
               ...res._doc,
               id:res._id,
               token
           }
      }
  }
}
