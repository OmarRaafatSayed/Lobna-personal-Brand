/**
 * WhatsApp notification utility
 * Uses Twilio WhatsApp API
 * Replace with actual Twilio credentials in .env
 */

const sendWhatsAppNotification = async (bookingData) => {
  try {
    // Check if Twilio credentials are configured
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      process.env.TWILIO_ACCOUNT_SID === 'your_twilio_account_sid'
    ) {
      console.log('⚠️  WhatsApp (Twilio) not configured. Skipping notification.');
      console.log('📋 Booking details:', bookingData);
      return { success: false, message: 'WhatsApp not configured' };
    }

    const twilio = require('twilio');
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const dayNames = {
      0: 'الأحد',
      1: 'الاثنين',
      2: 'الثلاثاء',
      3: 'الأربعاء',
      4: 'الخميس',
      5: 'الجمعة',
      6: 'السبت',
    };

    const platformName =
      bookingData.platform === 'google_meet' ? 'Google Meet' : 'Zoom';

    const message = `
🌸 *حجز استشارة جديد*

👤 *الاسم:* ${bookingData.name}
📱 *واتساب:* ${bookingData.whatsapp}
💼 *الحالة الوظيفية:* ${bookingData.jobStatus}
📅 *التاريخ:* ${bookingData.date}
🕐 *الوقت:* ${bookingData.time}
💻 *المنصة:* ${platformName}

💬 *الرسالة:*
${bookingData.message}

---
تم الإرسال تلقائياً من منصة لبنى ✨
    `.trim();

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.LOBNA_WHATSAPP_NUMBER,
      body: message,
    });

    console.log('✅ WhatsApp notification sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ WhatsApp notification error:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = { sendWhatsAppNotification };
