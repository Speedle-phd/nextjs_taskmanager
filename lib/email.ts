import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
export async function sendMail(
   recipientEmail: string,
   subject: string,
   html?: string,
   text?: string,
   recipientName?: string,
) {
   const mailersend = new MailerSend({
      apiKey: process.env.EMAIL_TOKEN!,
   })
   const sender = new Sender('info@speedle.dev')

   const recipient = recipientName
      ? [new Recipient(recipientEmail, recipientName)]
      : [new Recipient(recipientEmail)]

   const emailParams = new EmailParams()
      .setFrom(sender)
      .setSubject(subject)
      .setTo(recipient)

   if (html) {
      emailParams.setHtml(html)
   }
   if (text) {
      emailParams.setText(text)
   }

   await mailersend.email.send(emailParams)
}
