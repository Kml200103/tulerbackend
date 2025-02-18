import emailService from "../services/email/sendEmail.js"



const subscribe = async (req, res) => {
    try {
        const { email } = req.body
        if(!email){
            return res.status(401).json({status:false,message:"Email Required"})
        }
        await emailService.sendNewsletterSubscriptionEmail(email)
        return res.status(201).json({status:true,message:"Newsletter Send"})
    } catch (error) {

    }

}

export { subscribe }