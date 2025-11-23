type EmailParams = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: EmailParams) {
  const mailgunApiKey = process.env.MAILGUN_API_KEY || "MAILGUN_API_KEY";
  const mailgunDomain =
    process.env.MAINGUN_SANDBOX_DOMAIN || "MAINGUN_SANDBOX_DOMAIN";

  // Use native FormData and fetch API for Cloudflare Workers
  const formData = new FormData();
  formData.append("from", `Mailgun Sandbox <noreply@${mailgunDomain}>`);
  formData.append("to", to);
  formData.append("subject", subject);
  formData.append("text", text);

  try {
    const response = await fetch(
      `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${mailgunApiKey}`)}`,
          // Don't set Content-Type - let fetch handle it with boundary
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Mailgun API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    console.log(data); // logs response data
    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
