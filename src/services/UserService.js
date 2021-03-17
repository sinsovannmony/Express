const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

class UserService {
    constructor(userModel){
        this.userModel = userModel
    }
    changeusername(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const { currentusername, newusername } = reqBody;
                const username = currentusername;
                const usernameExists = await this.userModel.findOne({ username });
                if (!usernameExists) return resolve("Username not Exist");
                else
                {   usernameExists.updateOne({username : newusername} , function(err)
                    {if(err) console.log(err);
                     else return resolve("Username changed successful");            
                    })
                }
              }
              catch (error) {return resolve(error.message)}
        })
    }
    changepassword(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const {currentpassword , newpassword , token} = reqBody;
                const hashedNewPassword = await bcrypt.hash(newpassword,10);
                const verified = jwt.verify(token,process.env.SECRET);
                const email = verified;
                const userExists = await this.userModel.findOne({ email });
                if(!userExists) return resolve(err);
                else
                {
                  const oldhashedPassword = userExists.password;
                  bcrypt.compare(currentpassword, oldhashedPassword, (err, isMatch) => {
                    if (err) return resolve("Incorrect CurrentPassword");
                    else if (isMatch)
                    {
                      userExists.updateOne({password : hashedNewPassword} , function(err)
                      {
                        if(err) console.log(err);
                        else return resolve("Change password succesful");            
                      })
                    }
                    else return resolve("Incorrect CurrentPassword");
                  });
                }
            }
              catch (error) {return resolve(error.message)}
        })
    }
}
module.exports = UserService