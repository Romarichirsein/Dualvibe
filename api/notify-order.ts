import { Resend } from 'resend';

// Initialize Resend with API Key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { partner, product, price, promoCode, message } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'DualVibe <onboarding@resend.dev>', 
      to: ['dualvibe237@gmail.com'],
      subject: `NOUVELLE COMMANDE PARTENAIRE - ${partner}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1a1a1a;">
          <h1 style="color: #FF006E;">Nouvelle commande via DualVibe</h1>
          <p>Une commande vient d'être initiée pour votre partenaire <strong>${partner}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Détails :</strong></p>
          <ul>
            <li><strong>Produit :</strong> ${product}</li>
            <li><strong>Prix :</strong> ${price} FCFA</li>
            <li><strong>Code Promo utilisé :</strong> <span style="background: #fff0f6; color: #FF006E; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${promoCode || 'AUCUN'}</span></li>
          </ul>
          <p><strong>Message envoyé au partenaire :</strong></p>
          <blockquote style="background: #f9fafb; padding: 15px; border-left: 4px solid #00D1FF;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            DualVibe Auto-Notification System
          </p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
