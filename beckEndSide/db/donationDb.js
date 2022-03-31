import mongoose from 'mongoose'

 const userSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
   
    donationAmount:{
        type: Number,
        require: false
      },
    //   date:{
    //       type:  Date,
    //       require:true
          
    //   },
    },      {timestamps:true}

    )

     export const Donation = mongoose.model("Donation", userSchema)


     


 

   