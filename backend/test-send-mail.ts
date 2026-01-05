import { mailer } from "./src/utils/mailer";

async function testSendMail() {
  try {
    const info = await mailer.sendMail({
      from: "molhamthomas@gmail.com",
      to: "molhamthomas@gmail.com",
      subject: "Test Email from AI Health Project",
      text: "This is a test email sent from the backend mailer utility.",
      html: "<b>This is a test email sent from the backend mailer utility.</b>"
    });
    console.log("Email sent:", info);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

testSendMail();
