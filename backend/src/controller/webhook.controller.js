import { ENV } from "../config/env.js"
import { User } from "../Models/user.model.js"
import { Webhook } from 'svix'

const webhookSecret = ENV.webhookSecret

async function validateRequest(request) {
  const payloadString = await request.text()
  const headerPayload = headers()
  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id'),
    'svix-timestamp': headerPayload.get('svix-timestamp'),
    'svix-signature': headerPayload.get('svix-signature'),
  }
  const wh = new Webhook(webhookSecret)
  return wh.verify(payloadString, svixHeaders)
}


export const handleClerkWebhook = async (req, res) => {
  validateRequest(payload)
  const payload = await req.json()
 
  
  const { type, data } = payload

  try {
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
        }
      )
    }

    if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}