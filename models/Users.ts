import mongoose ,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";
// IUser -Interface of User
export interface IUser{
    email:string;
    password:string;
    _id?:mongoose.Types.ObjectId
    createdAt?:Date;
    updatedAt?:Date;
}

const userSchema = new Schema<IUser>(
    {
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
    },
},
{timestamps:true}
);
// Hook: Work before Processing and saving
// This Hook hash password only when user password field is modified due to some reason but when saving passowrd for the first time this hook will not work we must manually hash and save 
userSchema.pre("save",async function(next){
if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10)
}
next();
});

// Models : An array containing all models associated with this Mongoose instance.
// Model : This model is used when we want to create fresh model 
// As it is nextjs it cached so checked if there is already present
const  Users = models?.Users ||  model<IUser>("Users", userSchema);
export default Users;




