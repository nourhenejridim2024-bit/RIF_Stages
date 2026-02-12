import nodemailer from "nodemailer";

/**
 * SMTP Transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true", // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send login email to stagiaire
 */
export async function sendStagiaireLoginEmail(params: {
  to: string;
  prenom?: string | null;
  email: string;
  password: string; // ⚠ RAW password only (not hashed)
}) {
  const { to, prenom, email, password } = params;

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@rif-stages.com";

  const subject = "Vos identifiants de connexion - RIF Stages";

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Bonjour ${prenom ?? ""},</h2>

    <p>Votre compte stagiaire a été créé avec succès.</p>

    <div style="background:#f4f4f4;padding:15px;border-radius:8px;">
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Mot de passe :</strong> ${password}</p>
    </div>

    <p style="margin-top:20px;">
      Vous pouvez vous connecter ici :
      <br/>
      <a 
        href="${baseUrl}/connexion"
        style="display:inline-block;margin-top:10px;padding:10px 20px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:6px;"
      >
        Se connecter
      </a>
    </p>

    <p style="margin-top:20px;color:#777;font-size:13px;">
      Pensez à changer votre mot de passe après la première connexion.
    </p>

    <hr style="margin-top:30px;" />
    <p style="font-size:12px;color:#999;">
      RIF Stages - Gestion des stagiaires
    </p>
  </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log("✅ Email envoyé à :", to);
  } catch (error) {
    console.error("❌ Erreur envoi email :", error);
    throw new Error("Impossible d'envoyer l'email");
  }
}
