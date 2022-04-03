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
      date:{
          type:  String,
        //   default: new Date().toDateString(),
          require:true
          
      },
    },      {timestamps:true}

    )

     export const Donation = mongoose.model("Donation", userSchema)


     


 

   