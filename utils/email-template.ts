// interface SubscriptionEmailData {
//   userName: string;
//   subscriptionName: string;
//   renewalDate: string;
//   planName: string;
//   price: string;
//   paymentMethod: string;
//   accountSettingsLink: string;
//   supportLink: string;
//   daysLeft: number;
// }

interface OTPEmailData {
  userName: string;
  otp: string;
  type: 'verification' | 'reset';
  expiryMinutes: number;
}

interface EmailTemplate {
  label: string;
  generateSubject: (data: any) => string;
  generateBody: (data: any) => string;
}

// export const generateEmailTemplate = ({
//   userName,
//   subscriptionName,
//   renewalDate,
//   planName,
//   price,
//   paymentMethod,
//   accountSettingsLink,
//   supportLink,
//   daysLeft,
// }: SubscriptionEmailData) => `
// <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
//     <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
//         <tr>
//             <td style="background-color: #4a90e2; text-align: center;">
//                 <p style="font-size: 54px; line-height: 54px; font-weight: 800;">SubDub</p>
//             </td>
//         </tr>
//         <tr>
//             <td style="padding: 40px 30px;">                
//                 <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${userName}</strong>,</p>
                
//                 <p style="font-size: 16px; margin-bottom: 25px;">Your <strong>${subscriptionName}</strong> subscription is set to renew on <strong style="color: #4a90e2;">${renewalDate}</strong> (${daysLeft} days from today).</p>
                
//                 <table cellpadding="15" cellspacing="0" border="0" width="100%" style="background-color: #f0f7ff; border-radius: 10px; margin-bottom: 25px;">
//                     <tr>
//                         <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
//                             <strong>Plan:</strong> ${planName}
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style="font-size: 16px; border-bottom: 1px solid #d0e3ff;">
//                             <strong>Price:</strong> ${price}
//                         </td>
//                     </tr>
//                     <tr>
//                         <td style="font-size: 16px;">
//                             <strong>Payment Method:</strong> ${paymentMethod}
//                         </td>
//                     </tr>
//                 </table>
                
//                 <p style="font-size: 16px; margin-bottom: 25px;">If you'd like to make changes or cancel your subscription, please visit your <a href="${accountSettingsLink}" style="color: #4a90e2; text-decoration: none;">account settings</a> before the renewal date.</p>
                
//                 <p style="font-size: 16px; margin-top: 30px;">Need help? <a href="${supportLink}" style="color: #4a90e2; text-decoration: none;">Contact our support team</a> anytime.</p>
                
//                 <p style="font-size: 16px; margin-top: 30px;">
//                     Best regards,<br>
//                     <strong>The SubDub Team</strong>
//                 </p>
//             </td>
//         </tr>
//         <tr>
//             <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
//                 <p style="margin: 0 0 10px;">
//                     SubDub Inc. | 123 Main St, Anytown, AN 12345
//                 </p>
//                 <p style="margin: 0;">
//                     <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Unsubscribe</a> | 
//                     <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
//                     <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
//                 </p>
//             </td>
//         </tr>
//     </table>
// </div>
// `;

export const generateOTPEmailTemplate = ({
  userName,
  otp,
  type,
  expiryMinutes,
}: OTPEmailData) => `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f4f7fa;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="background-color: #4a90e2; text-align: center;">
                <p style="font-size: 54px; line-height: 54px; font-weight: 800;">Task Manager</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 40px 30px;">
                <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong style="color: #4a90e2;">${userName}</strong>,</p>
                
                <p style="font-size: 16px; margin-bottom: 25px;">${type === 'verification' ? 'Please verify your email address' : 'You requested a password reset'}. Use the following code to proceed:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #4a90e2; background-color: #f0f7ff; padding: 20px 40px; border-radius: 10px; letter-spacing: 5px;">${otp}</span>
                </div>
                
                <p style="font-size: 16px; margin-bottom: 25px;">This code will expire in <strong>${expiryMinutes} minutes</strong>. If you didn't request this, please ignore this email.</p>
                
                <p style="font-size: 16px; margin-top: 30px;">
                    Best regards,<br>
                    <strong>The Task Manager Team</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f0f7ff; padding: 20px; text-align: center; font-size: 14px;">
                <p style="margin: 0 0 10px;">
                    Task Manager | Secure Task Management Platform
                </p>
                <p style="margin: 0;">
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Privacy Policy</a> | 
                    <a href="#" style="color: #4a90e2; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                </p>
            </td>
        </tr>
    </table>
</div>
`;

interface EmailTemplate {
  label: string;
  generateSubject: (data: any) => string;
  generateBody: (data: any) => string;
}

export const emailTemplates: EmailTemplate[] = [
//   {
//     label: "7 days before reminder",
//     generateSubject: (data) =>
//       `📅 Reminder: Your ${data.subscriptionName} Subscription Renews in 7 Days!`,
//     generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 7 }),
//   },
//   {
//     label: "5 days before reminder",
//     generateSubject: (data) =>
//       `⏳ ${data.subscriptionName} Renews in 5 Days - Stay Subscribed!`,
//     generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 5 }),
//   },
//   {
//     label: "2 days before reminder",
//     generateSubject: (data) =>
//       `🚀 2 Days Left!  ${data.subscriptionName} Subscription Renewal`,
//     generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 2 }),
//   },
//   {
//     label: "1 days before reminder",
//     generateSubject: (data) =>
//       `⚡ Final Reminder: ${data.subscriptionName} Renews Tomorrow!`,
//     generateBody: (data) => generateEmailTemplate({ ...data, daysLeft: 1 }),
//   },
  {
    label: "email verification otp",
    generateSubject: (data) => `Verify Your Email - Task Manager`,
    generateBody: (data) => generateOTPEmailTemplate({ ...data, type: 'verification' }),
  },
  {
    label: "password reset otp",
    generateSubject: (data) => `Password Reset Code - Task Manager`,
    generateBody: (data) => generateOTPEmailTemplate({ ...data, type: 'reset' }),
  },
];