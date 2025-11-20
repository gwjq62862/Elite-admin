import { Webhook } from 'svix'
import { ENV } from "../config/env.js" 
import { User } from "../Models/user.model.js" 


const webhookSecret = ENV.webhookSecret

export const handleClerkWebhook = async (req, res) => {

    const rawBody = req.rawBody; 

    if (!rawBody) {
        console.error("Webhook processing failed: Raw body is missing. Check your index.js setup.");
        return res.status(400).send('Raw Body is Missing for Svix Verification');
    }

  
    const svixHeaders = {
        'svix-id': req.headers['svix-id'], 
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature'],
    };

    let event;
    

    try {
        const wh = new Webhook(webhookSecret);
     
        event = wh.verify(rawBody, svixHeaders); 
    } catch (err) {
        console.error('Error verifying webhook signature:', err.message);
        return res.status(400).send('Webhook Signature Verification Failed');
    }

   
    const { type, data } = event; 

    try {
        // --- Database Logic ---
        if (type === 'user.created') {
            await User.create({
                clerkId: data.id,
                email: data.email_addresses[0]?.email_address,
                firstName: data.first_name,
                lastName: data.last_name,
                imageUrl: data.image_url
            })
        }

        if (type === 'user.updated') {
            await User.findOneAndUpdate(
                { clerkId: data.id },
                {
                    email: data.email_addresses[0]?.email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    imageUrl: data.image_url
                },
                { new: true } 
            )
        }

        if (type === 'user.deleted') {
            await User.findOneAndDelete({ clerkId: data.id })
        }

       
        res.status(200).json({ success: true, message: 'Webhook received and processed' })
    } catch (error) {
        console.error('Database Webhook processing failed:', error)
      
        res.status(500).json({ error: 'Database processing failed' })
    }
}