const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");
const crypto = require("crypto");
const {ObjectId} = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:String,
    created:{
        type:Date,
        default:Date.now
    },
    updated: Date,
    photo:{
        data:Buffer,
        contentType:String
    },
    about:{
        type: String,
        trim:true
    },
    following:[{type:ObjectId,ref:"User"}],
    followers:[{type:ObjectId,ref:"User"}],
    resetPasswordLink:{
        data:String,
        default:""
    },
    role: {
        type: String,
        default: "subscriber"
    }

})
//creating virtual field for password
userSchema.
virtual('password')
.set(function(password){
    this._password = password;
    //generate timestamp
    this.salt =uuidv4();
    //encrypt the password
    this.hashed_password = this.encryptPassword(password);

})
.get(function(){
    return this._password;
});
// methods for encrypting password
userSchema.methods = {
    authentication: function(plainText){
      return this.encryptPassword(plainText) === this.hashed_password;
    },
    encryptPassword: function(password){
        if(!password) return '';
        try{
             return crypto.createHmac('sha1', this.salt)
             .update(password)
             .digest('hex');
        }
        catch{
                return "";
        }
    }
}
module.exports = mongoose.model("User",userSchema);
/* const mongoose = require ('mongoose')
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
 
 
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: true
    },
    email:{
        type: String,
        trim:true,
        required: true
    },
    hashed_password:{
        type: String,
        trim:true,
        required: true
    },
    salt:String,
    created:{
        type:Date,
        default:Date.now
    },
    updated: Date
});
 
 
 
 
//virtual field
 
userSchema
.virtual('password')
.set(function(password){
    this._password = password
    //generate a timestamp
    this.salt =  uuidv4();
 //encrypt pass
 
   this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password
});
 
//methods
 
userSchema.methods ={
    encryptPassword:function(password) {
        if(! password) return "";
        try{
           return crypto.createHmac('sha256', this.salt)
           .update(password)
           .digest('hex');
        }catch (err){
            return ""
        }
    }
}
 
module.exports=mongoose.model("User", userSchema); */