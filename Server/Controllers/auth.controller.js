import User from '../Models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
     const { username, email, password } = req.body;

     if (!username || username === '', !email || email === '', !password || password === '') {
          next(errorHandler(400, 'All fields are required'))
     } else {
          const hashPassword = bcryptjs.hashSync(password, 10)
          const newuser = new User({
               username, email, password: hashPassword
          })

          try {
               await newuser.save()
               res.json({ message: 'Signup Successful' })
          } catch (error) {
               next(error)
          }
     }
}

export const signin = async (req, res, next) => {
     const { email, password } = req.body;

     if (!email || !password || email === '' || password === '') {
          next(errorHandler(400, 'All fields are required'))
     }

     try {
          const validUser = await User.findOne({ email })
          if (!validUser) {
               return next(errorHandler(404, 'User not found'));
          }
          const validPassword = bcryptjs.compareSync(password, validUser.password)
          if (!validPassword) {
               return next(errorHandler(400, 'Invalid password'))
          }
          const token = jwt.sign(
               { id: validUser._id },
               process.env.JWT_SECRET
          );

          const { password: pass, ...user } = validUser._doc

          res.status(200)
               .cookie('access_token', token, {
                    httpOnly: true,
               })
               .json({ user });
     } catch (error) {
          next(error);
     }
};