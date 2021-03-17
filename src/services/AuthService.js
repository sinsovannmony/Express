const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
class AuthService {
    constructor(userModel,confirmModel,customizeModel){
        this.userModel = userModel
        this.confirmModel = confirmModel
        this.customizeModel = customizeModel
    }
    register(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const email = reqBody.email;
                console.log(email);
                const userExists = await this.userModel.findOne({ email }).populate('confirm');
                console.log(userExists);
                if (userExists && userExists.activated) return resolve("email is already taken");
                else if(userExists && !userExists.activated) {
                  let transporter = nodemailer.createTransport({
                    service: "Gmail",
                    port: 2525,
                    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD,},
                    tls: {rejectUnauthorized: false,},
                    });
                  let mailOptions = {
                    from: process.env.EMAIL,
                    to: email, 
                    subject: 'ConfirmCode',
                    text: 'VerifyCode: '+ userExists.confirm.code, 
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) return resolve("invalid email");
                    else { return resolve("email has not been activated. Resending confirm code");}});
                }
                else 
                {
                  const confirmcode= Math.floor(100000 + Math.random() * 900000);
                  const hashedPassword = await bcrypt.hash(reqBody.password,10);
                  const {username,gender} = reqBody;
                  const password = hashedPassword;
                  const newConfirm = await this.confirmModel.create({code:confirmcode})
                  const newCustomize = await this.customizeModel.create({hatStyle:"",hairStyle:"",hairColor:"",glasses:"",skinColor:"",shirtColor:"",pantColor:"",gender:""})
                  const newUser = await this.userModel.create({ username, password, email , gender,confirm : newConfirm._id , customize : newCustomize._id});
                  let transporter = nodemailer.createTransport({
                    service: "Gmail",
                    port: 2525,
                    auth: {user: process.env.EMAIL,pass: process.env.PASSWORD},
                    tls: {rejectUnauthorized: false,},});
                  let mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'ConfirmCode', 
                    text: 'VerifyCode: '+confirmcode,
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) return resolve("invalid email");
                    else { return resolve("confirmation code sent");}});
                }
              }
              catch (error) {return resolve(error.message)}
        })
    }
    confirmEmail(reqBody){
        return new Promise(async(resolve,reject)=>{
            try{
                const {email,code} = reqBody;
                const user = await this.userModel.findOne({email}).populate('confirm')
                if(user && user.activated) return resolve("email already confirmed")
                if(!user) return resolve("email has not been registered yet")
                if(code != user.confirm.code) return resolve("incorrect confirmation code")
                else{
                  const token = jwt.sign(email, process.env.SECRET);
                  await this.userModel.updateOne({email},{activated:true})
                  return resolve(token)
                }
                
              }
            catch(error) {return resolve(error.message)}
        })
    }
    login(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const { email, password } = reqBody;
                const userExists = await this.userModel.findOne({ email })
                if (!userExists) return resolve("incorrect email")
                else if(userExists&&!userExists.activated) return resolve("user has not been confirmed yet")
                else
                {
                  const hashedPassword = userExists.password;
                  bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) return resolve(err);
                    else if (isMatch)
                    {
                      const token = jwt.sign(email, process.env.SECRET);
                      return resolve(token+"/"+userExists.username+"/"+email+"/"+userExists.gender);
                    }
                    else return resolve("incorrect password");
                  });
                }
              } 
              catch (error) {return resolve({ msg: error.message});}
        })
    }
    forgotPassword(reqBody){
        return new Promise(async (resolve,reject)=>{
            try
            {
              const email = reqBody.email;
              const userExists = await this.userModel.findOne({ email }).populate('confirm');
              if (!userExists) resolve("incorrect email");
              else if(userExists&&!userExists.activated) return resolve("email has not been confirmed yet")
              else
              {
                const resetcode= Math.floor(100000 + Math.random() * 900000);
                const newConfirm = await this.confirmModel.create({code:resetcode})
                const newUser = await this.userModel.updateOne({email},{confirm : newConfirm._id});
                let transporter = nodemailer.createTransport({
                  service: "Gmail",
                  port: 2525,
                  auth: {user: process.env.EMAIL,pass: process.env.PASSWORD},
                  tls: {rejectUnauthorized: false},});
                let mailOptions = {
                  from: process.env.EMAIL, 
                  to: email,
                  subject: 'ResetPassword', 
                  text: 'ResetCode : ' + resetcode ,
                };
                 transporter.sendMail(mailOptions, (error, info) => {
                  if(error) resolve("Invalid Email");
                  else{ return resolve("Sending to your email");}
                  });
              }
            }
            catch (error) {return res.json({ msg: error.message});}
        })
    }
    confirmReset(reqBody){
        return new Promise(async (resolve,reject)=>{
            try{
                const {email,code,newpassword} = reqBody;
                console.log(code)
                const hashedNewPassword = await bcrypt.hash(newpassword,10);
                const user = await this.userModel.findOne({email}).populate('confirm')
                if(user && !user.activated) return resolve("email has not been confirmed yet")
                if(!user) return resolve("incorrect email")
                if(code != user.confirm.code) return resolve("incorrect confirmation code")
                await this.userModel.updateOne({email},{password:hashedNewPassword})
                return resolve("forgotpassword succesful")
              }
              catch(error){return resolve(error.message);}
            })
          }
      }

module.exports = AuthService

