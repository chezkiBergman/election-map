
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
      type: String,
    },
    resetPassOrActivateUserExpires: {
      type: Date,
    
    },
    activateUserByMail:{
      type: String, 
        option: ['Pending', 'Active'],
        default: 'Pending'
    },
    
      isUserOnline:{
         type: Boolean,
        option:[true,false],
        default:false
      },
    
  
    permissions:{
      type: String,
      option:["admin","user"],
      default: "user"
    },
    sumDonationHistory:{
      type: Number,
      ref: 'Donation',
      default: 0
    },
    sumOfComments:{
      type:Number,
      default: 0
    }
  });

 

     export const User = mongoose.model("User", userSchema)


     


 

   