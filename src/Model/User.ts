import mongoose , {Schema , Document} from "mongoose";


// message 
// interface means type of data type 
//    
 export interface Message extends Document{
    content: string,
    createdAt: Date
}


const MessageSchema: Schema<Message> = new Schema({
   content: {
    type: String,
    required: true
   },
   createdAt: {
    type: Date,
    required: true,
    default: Date.now
   }
}) 


// user
 export interface User extends Document{
   username: string,
   email: string,
   password: string,
   verifyCode: string,
   verifyCodeExpiry: Date,
   isVerified: boolean,
   isAcceptingMessage: boolean,
   messages: Message[]

}

// <> means follow custom schema 
const UserSchema: Schema<User> = new Schema({
 username: {
    type: String,
    required: [true , "Username is required!"],
    trim: true,
    unique: true
 },
 email: {
   type: String,
   required: true,
unique: true,
match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'please use a vaild email address']
 },
 password: {
    type: String,
   required: [true , "password is required!"],
 },
 verifyCode: {
      type: String,
   required: [true , "Verify code is required!"]
 },
 verifyCodeExpiry: {
    type: Date,
    required: [true , "Verify code expiry is required field"]
 },
isVerified: {
    type: Boolean,
    default: false
},
isAcceptingMessage: {
    type: Boolean,
    default: false
},
   messages: [MessageSchema]
   
}) 

// get locked-in nigga  

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User" , UserSchema)

export default UserModel