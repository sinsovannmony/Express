const ObjectId  = require('mongodb').ObjectID;
class CustomizeService {
    constructor(customizeModel,userModel){
        this.customizeModel = customizeModel
        this.userModel = userModel
    }
    customizeAvatar(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const email = reqBody.email
                const {hatStyle,hairStyle,hairColor,glasses,skinColor,shirtColor,pantColor,gender} = reqBody
                const user = await this.userModel.findOne({email}).populate('customize')
                const customizeID = user.customize._id;
                if(!user) return resolve("incorrect email")
                else {
                    await this.customizeModel.updateOne({_id: ObjectId(customizeID)}, {
                        $set: {
                            hatStyle: hatStyle,
                            hairStyle: hairStyle,
                            hairColor:hairColor,
                            glasses:glasses,
                            skinColor:skinColor,
                            shirtColor:shirtColor,
                            pantColor:pantColor,
                            gender:gender
                            }
                        },function(err) {if(err) console.log(err);
                            else return resolve(hatStyle+"/"+hairStyle+"/"+hairColor+"/"+glasses+"/"+skinColor+"/"+shirtColor+"/"+pantColor+"/"+gender);}
                    )
                }
              }
              catch (error) {return resolve(error.message)}
        })
    }
}
module.exports = CustomizeService