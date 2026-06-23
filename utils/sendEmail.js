const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
              <h2 style="color: #2563eb;">DevTinder Notification</h2>
              
              <p>Hello,</p>
              
              <p>You have pending connection requests waiting for your response.</p>
              
              <p><strong>${body}</strong></p>
              
              <p>Please log in to your account and review them.</p>
              
              <hr />
              
              <p style="font-size: 12px; color: #666;">
                This is an automated email from DevTinder.
              </p>
            </div>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (subject, body) => {
  const toAddress = "23ce359.saurabh.dave@vvpedulink.ac.in";
  const fromAddress =  "23ce359.saurabh.dave@vvpedulink.ac.in";
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    fromAddress,
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { SendEmailCommand.MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports =  { run };