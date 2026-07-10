const RESEND_API_URL = "https://api.resend.com/emails";

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  return { apiKey };
};

const sendResendEmail = async ({
  from,
  to,
  subject,
  html,
  text,
  replyTo,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) => {
  const { apiKey } = getResendConfig();

  if (!from) {
    throw new Error("Missing sender email configuration.");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Failed to send email. ${bodyText}`);
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatService = (value: string) => {
  const normalized = value.trim().toLowerCase();

  const map: Record<string, string> = {
    "brand identity design": "Brand Identity Design",
    "social media design": "Social Media Design",
    "event branding design": "Event Branding Design",
    "3d mockup design": "3D Mockup Design",
    others: "Others",
  };

  return map[normalized] || value;
};

const formatBudget = (value: string) => {
  const normalized = value.trim().toLowerCase();

  const map: Record<string, string> = {
    "under-500": "Under $500",
    "500-1500": "$500 - $1,500",
    "1500-5000": "$1,500 - $5,000",
    "5000-plus": "$5,000+",
  };

  return map[normalized] || (value.trim() || "Not specified");
};

const formatContactMethod = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "whatsapp") return "WhatsApp";
  if (normalized === "email") return "Email";
  return value;
};

const getFirstName = (fullName: string) => {
  const first = fullName.trim().split(/\s+/)[0] || "there";
  return first;
};

export const sendAdminOtpEmail = async ({
  to,
  code,
  expiresInMinutes,
}: {
  to: string;
  code: string;
  expiresInMinutes: number;
}) => {
  const adminFromEmail = process.env.RESEND_ADMIN_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;

  await sendResendEmail({
    from: adminFromEmail || "",
    to,
    subject: "Your Admin Verification Code",
    html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2 style="margin:0 0 12px">Admin Login Verification</h2>
          <p style="margin:0 0 12px">Use this code to complete your admin login:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:0 0 12px">${code}</p>
          <p style="margin:0;color:#6b7280">This code expires in ${expiresInMinutes} minutes.</p>
        </div>
      `,
    text: `Your admin verification code is ${code}. It expires in ${expiresInMinutes} minutes.`,
  });
};

export const sendLeadAcknowledgementEmail = async ({
  to,
  fullName,
  service,
  budget,
  contactMethod,
}: {
  to: string;
  fullName: string;
  service: string;
  budget: string;
  contactMethod: string;
}) => {
  const clientFromEmail = process.env.RESEND_CLIENT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL;
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL || "huesixteen@gmail.com";
  const firstName = escapeHtml(getFirstName(fullName));
  const serviceLabel = escapeHtml(formatService(service));
  const budgetLabel = escapeHtml(formatBudget(budget));
  const contactLabel = escapeHtml(formatContactMethod(contactMethod));

  await sendResendEmail({
    from: clientFromEmail || "",
    to,
    subject: "We received your project inquiry - Hue Sixteen",
    replyTo: replyToEmail,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111827;max-width:680px">
        <p>Hi <strong>${firstName}</strong>,</p>

        <p>Thank you for reaching out to <strong>Hue Sixteen</strong>.</p>

        <p>
          We've successfully received your project inquiry, and our team will review the details you've shared.
          We'll get back to you as soon as possible through your preferred contact method to discuss the next steps.
        </p>

        <h3 style="margin-top:24px">Here's what we received:</h3>
        <ul style="padding-left:20px">
          <li><strong>Project:</strong> ${serviceLabel}</li>
          <li><strong>Budget:</strong> ${budgetLabel}</li>
          <li><strong>Preferred Contact:</strong> ${contactLabel}</li>
        </ul>

        <p>
          If you'd like to add anything else before we get in touch, simply reply to this email.
        </p>

        <p>
          We're excited about the opportunity to work with you and help bring your ideas to life.
        </p>

        <p style="margin-top:24px">
          Best regards,<br /><br />
          <strong>Abdullah Al Faysal</strong><br />
          Founder &amp; Brand Designer<br />
          <strong>Hue Sixteen</strong>
        </p>
      </div>
    `,
    text: `Hi ${getFirstName(fullName)},

Thank you for reaching out to Hue Sixteen.

We've successfully received your project inquiry, and our team will review the details you've shared. We'll get back to you as soon as possible through your preferred contact method to discuss the next steps.

Here's what we received:
- Project: ${formatService(service)}
- Budget: ${formatBudget(budget)}
- Preferred Contact: ${formatContactMethod(contactMethod)}

If you'd like to add anything else before we get in touch, simply reply to this email.

We're excited about the opportunity to work with you and help bring your ideas to life.

Best regards,
Abdullah Al Faysal
Founder & Brand Designer
Hue Sixteen`,
  });
};
