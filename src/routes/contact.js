import { Router } from 'express'
import { env } from '../config/env.js'
import { Message } from '../models/Message.js'

const router = Router()

router.post('/', async (request, response) => {
  const { name, email, message, subject } = request.body || {}
  const normalizedSubject = subject || 'New Contact Form Submission'

  if (!name || !email || !message) {
    return response.status(400).json({ error: 'Missing required fields.' })
  }

  const record = await Message.create({
    name,
    email,
    subject: normalizedSubject,
    message,
  })

  const emailConfigured = Boolean(env.emailjsServiceId && env.emailjsTemplateId && env.emailjsPublicKey)
  const telegramConfigured = Boolean(env.telegramBotToken && env.telegramChatId)

  const sendEmail = async () => {
    if (!emailConfigured) {
      await Message.findByIdAndUpdate(record._id, {
        emailStatus: 'skipped',
        emailError: 'EmailJS is not configured.',
      })

      throw new Error('EmailJS is not configured.')
    }

    const emailData = {
      service_id: env.emailjsServiceId,
      template_id: env.emailjsTemplateId,
      user_id: env.emailjsPublicKey,
      template_params: {
        from_name: name,
        name,
        from_email: email,
        email,
        subject: normalizedSubject,
        message,
        reply_to: email,
        to_name: 'Site Owner',
        sent_from: `${name} <${email}>`,
        to_email: env.contactToEmail,
      },
      ...(env.emailjsPrivateKey ? { accessToken: env.emailjsPrivateKey } : {}),
    }

    const result = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!result.ok) {
      const errorText = await result.text()
      await Message.findByIdAndUpdate(record._id, {
        emailStatus: 'failed',
        emailError: errorText,
      })
      throw new Error(errorText || 'Email delivery failed.')
    }

    await Message.findByIdAndUpdate(record._id, {
      emailStatus: 'sent',
      emailError: '',
    })

    return true
  }

  const sendTelegram = async () => {
    if (!telegramConfigured) {
      await Message.findByIdAndUpdate(record._id, {
        telegramStatus: 'skipped',
        telegramError: 'Telegram is not configured.',
      })
      throw new Error('Telegram is not configured.')
    }

    const telegramText = [
      'New portfolio contact form submission',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${normalizedSubject}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const result = await fetch(`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: env.telegramChatId,
        text: telegramText,
      }),
    })

    if (!result.ok) {
      const errorText = await result.text()
      await Message.findByIdAndUpdate(record._id, {
        telegramStatus: 'failed',
        telegramError: errorText,
      })
      throw new Error(errorText || 'Telegram delivery failed.')
    }

    await Message.findByIdAndUpdate(record._id, {
      telegramStatus: 'sent',
      telegramError: '',
    })

    return true
  }

  const results = await Promise.allSettled([sendEmail(), sendTelegram()])
  const emailSuccess = results[0].status === 'fulfilled'
  const telegramSuccess = results[1].status === 'fulfilled'

  if (!emailSuccess && !telegramSuccess) {
    return response.status(502).json({
      error: 'Both email and Telegram delivery failed.',
      results,
    })
  }

  let successMessage = 'Message sent successfully! I will get back to you within 24 hours.'

  if (emailSuccess && !telegramSuccess) {
    successMessage += ' Email sent, but Telegram notification failed.'
  }

  if (!emailSuccess && telegramSuccess) {
    successMessage += ' Telegram notification sent, but email delivery failed.'
  }

  return response.json({
    success: true,
    message: successMessage,
  })
})

export { router as contactRouter }
