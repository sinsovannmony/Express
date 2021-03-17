const bcrypt = require("bcrypt")

class RoomService {
    constructor(roomModel){
        this.roomModel = roomModel
    }
    createpublicroom(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const {roomname , description} = reqBody;
                const hashedPassword = await bcrypt.hash(reqBody.password,10);
                const password = hashedPassword;
                const roomExists = await this.roomModel.findOne({ roomname });
                if (roomExists) return resolve("roomname already taken");
                else
                { const newRoom = await this.roomModel.create({ roomname, password, description});
                  return resolve("create publicroom successful");
                }
              }
              catch (error) {return resolve(error.message)}
        })
    }
    createprivateroom(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const {roomname , description ,isprivate } = reqBody;
                const hashedPassword = await bcrypt.hash(reqBody.password,10);
                const password = hashedPassword;
                const roomExists = await this.roomModel.findOne({ roomname });
                if (roomExists) return resolve("roomname already taken");
                else
                { 
                    await this.roomModel.create({ roomname, password, description});
                    await this.roomModel.updateOne({roomname},{isprivate:true});
                    console.log("X")
                  return resolve("create privateroom successful");
                }
              }
              catch (error) {return resolve("Hello")}
        })
    }
    checkroom(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const roomname = reqBody.roomname;
                const roomExists = await this.roomModel.findOne({ roomname });
                if (!roomExists) return resolve("incorrect roomname");
                else
                {
                    if(roomExists.isprivate)
                    {
                        return resolve("privateroom")
                    }
                    else return resolve("publicroom")
                }
            }
              catch (error) {return resolve(error.message)}
        })
    }
    joinroom(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const {roomname , password} = reqBody;
                const roomExists = await this.roomModel.findOne({ roomname });
                if (!roomExists) return resolve("incorrect roomname");
                else
                {
                    const hashedPassword = roomExists.password;
                    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    if (err) console.log(err);
                    else if (isMatch){return resolve("joinroom successful");}
                    else return resolve("incorrect password");
                    });
                }
            }
              catch (error) {return resolve(error.message)}
        })
    }
    deleteroom(reqBody){
        return new Promise(async(resolve,reject)=>{
            try {
                const roomname = reqBody.roomname;
                const roomExists = await this.roomModel.findOne({ roomname });
                if (!roomExists) return resolve("incorrect roomname");
                else
                {
                    roomExists.deleteOne(function(err)
                        {
                            if(err) console.log("err");
                            else console.log("delete room sucessful");
                        })
                }

            }
              catch (error) {return resolve(error.message)}
        })
    }
}
module.exports = RoomService