import { Resend } from 'resend';
import { siteConfig } from '@/config/site';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? `orders@${siteConfig.url.replace(/^https?:\/\//, '')}`;

// ─── Email Senders ────────────────────────────────────────────────────────────

export async function sendOrderConfirmation({
  toEmail,
  customerName,
  orderNumber,
  items,
  totalAmount,
}: {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://stepkicks.lk';
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `Your Order Inquiry — ${siteConfig.name} ${orderNumber}`,
    html: `
      <h2>Hi ${customerName}, thanks for your interest!</h2>
      <p>We've received your inquiry for:</p>
      <ul>
        ${items.map(item => `
          <li><strong>${item.productName}</strong> (Size: ${item.selectedSize}) x ${item.quantity} - LKR ${item.price.toLocaleString()}</li>
        `).join('')}
      </ul>
      <p><strong>Total: LKR ${totalAmount.toLocaleString()}</strong></p>
      <p>Our team will contact you on WhatsApp shortly.</p>
      <hr/>
      <small>${siteConfig.name} — Premium Shoes & Bags</small>
    `,
  });
}

export async function sendNewOrderNotification({
  adminEmail,
  orderNumber,
  customerName,
  customerPhone,
  items,
  totalAmount,
}: {
  adminEmail: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  totalAmount: number;
}) {
  const adminUrl = process.env.NEXTAUTH_URL ?? siteConfig.url;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `🛍️ New Order Inquiry — ${orderNumber}`,
    html: `
      <h2>New Order Inquiry</h2>
      <p><strong>Order #:</strong> ${orderNumber}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <h3 style="margin-top: 20px;">Items:</h3>
      <ul>
        ${items.map(item => `
          <li><strong>${item.productName}</strong> (Size: ${item.selectedSize} | Color: ${item.selectedColor}) x ${item.quantity}</li>
        `).join('')}
      </ul>
      <p><strong>Total Value: LKR ${totalAmount.toLocaleString()}</strong></p>
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
  const loginUrl = process.env.NEXTAUTH_URL ?? siteConfig.url;
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: `Welcome to ${siteConfig.name} Staff Portal`,
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
