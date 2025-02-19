import emailService from "../services/email/sendEmail.js"



const subscribe = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(401).json({ status: false, message: "Email Required" })
        }
        await emailService.sendNewsletterSubscriptionEmail(email)
        return res.status(201).json({ status: true, message: "Newsletter Send" })
    } catch (error) {

    }

}


const sendFeedBack = async (req, res) => {
    try {
        const feedback = req.body;

        if (!feedback.name || !feedback.email || !feedback.subject || !feedback.description) {
            return res.status(400).json({ message: "All fields are required." });
        }

        await emailService.sendFeedbackEmail(feedback);
        res.status(200).json({ status:true,message: "Feedback email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { subscribe,sendFeedBack }