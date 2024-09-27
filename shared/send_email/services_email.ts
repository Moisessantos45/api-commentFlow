import { config } from "dotenv";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import { resetPasswordEmailTemplate } from "./template";

config();
const api_key = process.env.API_KEY_RESEND;

const sendEmail = async (email: string) => {
  if (!api_key) {
    return;
  }

  const transactionalEmailsApi = new TransactionalEmailsApi();

  transactionalEmailsApi.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey,
    api_key
  );

  const sender = {
    email,
    name: "CommentFlow",
  };
  try {
    const recivers = [{ email: "santosxphdz34@gmail.com", name: "Shigatsu" }];
    await transactionalEmailsApi.sendTransacEmail({
      sender,
      to: recivers,
      subject: "Welcome to CommentFlow",
      htmlContent: resetPasswordEmailTemplate("ghjasgd"),
    });

    return {
      status: 200,
      message: "Email sent successfully",
      success: true,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Error sending email",
      success: false,
    };
  }
};

export { sendEmail };
