import mongoose from 'mongoose'

 const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
    donationAmount:{
      type:   Number ,
        require: false
      },
      sumDonationHistory:{
       type:  Number
      },
    
    },      {timestamps:true}

    )

     export const Donation = mongoose.model("Donation", userSchema)


     


 

   