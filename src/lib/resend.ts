import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? 'orders@stepkicks.lk';

// ─── Email Senders ────────────────────────────────────────────────────────────

export async function sendOrderConfirmation({
  toEmail,
  customerName,
  orderNumber,
  productName,
  selectedSize,
  selectedColor,
  price,
  productSlug,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  productName: string;
  selectedSize: string;
  selectedColor: string;
  price: number;
  productSlug: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stepkicks.lk';
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `Your Order Inquiry — StepKicks ${orderNumber}`,
    html: `
      <h2>Hi ${customerName}, thanks for your interest!</h2>
      <p>We've received your inquiry for:</p>
      <ul>
        <li><strong>${productName}</strong></li>
        <li>Size: ${selectedSize}</li>
        <li>Color: ${selectedColor}</li>
        <li>Price: LKR ${price.toLocaleString()}</li>
      </ul>
      <p>Our team will contact you on WhatsApp shortly.</p>
      <p><a href="${siteUrl}/shop/${productSlug}">View Product →</a></p>
      <hr/>
      <small>StepKicks — Premium Shoes & Bags</small>
    `,
  });
}

export async function sendNewOrderNotification({
  adminEmail,
  orderNumber,
  customerName,
  customerPhone,
  productName,
  selectedSize,
  selectedColor,
}: {
  adminEmail: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  selectedSize: string;
  selectedColor: string;
}) {
  const adminUrl = process.env.NEXTAUTH_URL ?? 'https://stepkicks.lk';
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `🛍️ New Order Inquiry — ${productName} (Size ${selectedSize})`,
    html: `
      <h2>New Order Inquiry</h2>
      <p><strong>Order #:</strong> ${orderNumber}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Product:</strong> ${productName}</p>
      <p><strong>Size:</strong> ${selectedSize} | <strong>Color:</strong> ${selectedColor}</p>
      <p><a href="${adminUrl}/admin/orders">View in Admin Panel →</a></p>
    `,
  });
}

export async function sendStaffWelcome({
  toEmail,
  staffName,
  tempPassword,
}: {
  toEmail: string;
  staffName: string;
  tempPassword: string;
}) {
  const loginUrl = process.env.NEXTAUTH_URL ?? 'https://stepkicks.lk';
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: 'Welcome to StepKicks Staff Portal',
    html: `
      <h2>Welcome, ${staffName}!</h2>
      <p>Your staff account has been created. Login details:</p>
      <ul>
        <li><strong>Email:</strong> ${toEmail}</li>
        <li><strong>Temporary Password:</strong> ${tempPassword}</li>
      </ul>
      <p><a href="${loginUrl}/admin/login">Login to Staff Portal →</a></p>
      <p>Please change your password after first login.</p>
    `,
  });
}
