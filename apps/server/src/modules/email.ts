import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Mailgen from "mailgen";
import fs from "fs";
import config from "./config";
import thresholdNotice from "@/email-templates/threshold-notice";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Inventory Tracker",
    link: "https://github.com/carloscortonc/inventory-tracker",
  },
});

export const generateEmailContent = (
  params: Mailgen.Content & { subject: string },
): Pick<Mail.Options, "subject" | "html"> => ({
  subject: params.subject,
  html: mailGenerator.generate({ body: params.body }),
});

export async function sendEmail(options: Pick<Mail.Options, "to" | "subject" | "html">): Promise<void> {
  return new Promise((resolve, reject) => {
    transporter.sendMail({ ...options, from: `Inventory Tracker <${config.email.username}>` }, function (error, info) {
      error ? reject("Error sending email ".concat(error.message)) : resolve();
    });
  });
}
