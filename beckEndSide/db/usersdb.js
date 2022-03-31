
import mongoose from 'mongoose'

 const userSchema = new mongoose.Schema({
     image:{
     type: String,
     require:true
    
     },
    name: {
        type: String,
        require: true,
        
    },
    email:{
        type: String,
        require: true,
        
    },
  
    pass:{
      type: String,
      require: true
    },
    resetPassOrActivateUserToken: {
      type: Date,
    },
    resetPassOrActivateUserExpires: {
      type: Date,
    
    },
    activateUserByMail:{
      type: String, 
        option: ['Pending', 'Active'],
        default: 'Pending'
    },
  
    permissions:{
      type: String,
      option:["admin","user"],
      default: "user"
    }
  });

 

     export const User = mongoose.model("User", userSchema)


     


 

   