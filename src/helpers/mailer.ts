import nodemailer, {SendMailOptions} from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@db/models/user";

//TODO: need to think about the different types of mails
export type mailType = 'ACCOUNT_VERIFICATION' | 'NOTIFICATION' | 'FORGOT_PASSWORD';

interface mailParams {
    recipient: string; 
    userId: string;
    emailType: mailType; 
    subject: string;
}

export const sendMail = async ({
    recipient,
    userId,
    emailType,
    subject,
}: mailParams) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if(emailType === "ACCOUNT_VERIFICATION") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        } else if(emailType === "FORGOT_PASSWORD") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_USERNAME,
                pass: process.env.MAILER_SECRET,
            }
        });
    
        const mailOptions: SendMailOptions = {
            from: process.env.MAILER_USERNAME,
            to: recipient,
            subject,
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "ACCOUNT_VERIFICATION" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        }
        const response = await transporter.sendMail(mailOptions);
        
        return response;
    } catch (error) {
        throw new Error("Could not send email");
    }
}