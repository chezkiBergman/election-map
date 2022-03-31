import nodemailer from 'nodemailer'
import {google} from 'googleapis'
import dotenv from 'dotenv'
dotenv.config() 
console.log(process.env.EMAIL_ADDRESS);


const oAuth2client = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)


oAuth2client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

export async function sendEmail({to,subject,text}) {
  try{
    const accessToken = await oAuth2client.getAccessToken()
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
         type: 'OAuth2',
          user: process.env.EMAIL_ADDRESS,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken
         
    },
    tls : { rejectUnauthorized: false }
  })
  /* Send the email */
  let info ={
    from: `noReplay@enron.com',`,
    to,
    subject,
    text
  }
  
   const send = await transporter.sendMail(info)
   console.log('send mail');
   return send 
  
  }catch(error){
    console.log(error);
  return 
  }
  
}

  