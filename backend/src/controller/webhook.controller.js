import { User } from "../Models/user.model.js"


export const handleClerkWebhook = async (req, res) => {
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