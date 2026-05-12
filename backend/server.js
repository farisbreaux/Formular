require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Email: HTML ──────────────────────────────────────────────────────────────

function buildHtmlEmail(d) {
  const sectionsHtml = (d.sections || [])
    .map(s => `<li style="padding:3px 0;">${s}</li>`)
    .join('');

  const servicesHtml = (d.services || []).length
    ? (d.services || []).map(s => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;">${s.name || '—'}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;">${s.price ? s.price + ' €' : '—'}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;">${s.duration ? s.duration + ' Min' : '—'}</td>
        </tr>`).join('')
    : '<tr><td colspan="3" style="padding:10px 14px;color:#aaa;">Keine Angabe</td></tr>';

  const days = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  const hoursObj = d.openingHours || {};
  const hoursHtml = days.map(day => `
    <tr>
      <td style="padding:5px 0;font-weight:600;color:#555;width:130px;">${day}</td>
      <td style="padding:5px 0;">${hoursObj[day] || 'Geschlossen'}</td>
    </tr>`).join('');

  const yesNo = v =>
    v ? '<span style="color:#22c55e;font-weight:600;">✓ Ja</span>'
      : '<span style="color:#aaa;">✗ Nein</span>';

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>Briefing</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <div style="background:#0d0d0d;padding:36px 44px;">
    <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#666;margin-bottom:10px;">localoutput.com</div>
    <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Neues Briefing</h1>
    <p style="margin:8px 0 0;color:#888;font-size:15px;">${d.companyName} &middot; ${d.industry} &middot; ${d.city}</p>
  </div>

  <div style="padding:44px;">

    <table width="100%" style="border-collapse:collapse;margin-bottom:40px;">
      <tr><td colspan="2" style="padding-bottom:14px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;border-bottom:1px solid #f0f0f0;">01 — Unternehmen</td></tr>
      <tr><td style="padding:10px 0;color:#999;width:180px;vertical-align:top;">Unternehmensname</td><td style="padding:10px 0;font-weight:600;">${d.companyName || '—'}</td></tr>
      <tr><td style="padding:10px 0;color:#999;">Branche</td><td style="padding:10px 0;">${d.industry || '—'}</td></tr>
      <tr><td style="padding:10px 0;color:#999;">Stadt</td><td style="padding:10px 0;">${d.city || '—'}</td></tr>
      <tr><td style="padding:10px 0;color:#999;vertical-align:top;">Besonderheit</td><td style="padding:10px 0;">${d.special || '—'}</td></tr>
      <tr><td style="padding:10px 0;color:#999;">Website vorhanden</td><td style="padding:10px 0;">${d.hasWebsite ? 'Ja' : 'Nein'}</td></tr>
    </table>

    <div style="margin-bottom:40px;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;border-bottom:1px solid #f0f0f0;padding-bottom:14px;margin-bottom:18px;">02 — Designstil</div>
      <div style="font-size:22px;font-weight:700;color:#111;">${d.style || '—'}</div>
    </div>

    <div style="margin-bottom:40px;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;border-bottom:1px solid #f0f0f0;padding-bottom:14px;margin-bottom:18px;">03 — Gewünschte Sections</div>
      <ul style="margin:0;padding-left:20px;line-height:2;">${sectionsHtml}</ul>
    </div>

    <div style="margin-bottom:40px;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;border-bottom:1px solid #f0f0f0;padding-bottom:14px;margin-bottom:18px;">04 — Inhalte</div>

      <div style="font-weight:600;color:#333;margin-bottom:10px;font-size:13px;">Leistungen</div>
      <table width="100%" style="border-collapse:collapse;border:1px solid #f0f0f0;border-radius:8px;overflow:hidden;margin-bottom:28px;">
        <thead>
          <tr style="background:#fafafa;">
            <th style="padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#bbb;">Leistung</th>
            <th style="padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#bbb;">Preis</th>
            <th style="padding:10px 14px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#bbb;">Dauer</th>
          </tr>
        </thead>
        <tbody>${servicesHtml}</tbody>
      </table>

      <div style="font-weight:600;color:#333;margin-bottom:10px;font-size:13px;">Öffnungszeiten</div>
      <table style="border-collapse:collapse;margin-bottom:24px;">${hoursHtml}</table>

      <div style="font-weight:600;color:#333;margin-bottom:10px;font-size:13px;">Kontaktdaten</div>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:7px 0;color:#999;width:100px;">Telefon</td><td style="padding:7px 0;">${d.phone || '—'}</td></tr>
        <tr><td style="padding:7px 0;color:#999;">E-Mail</td><td style="padding:7px 0;"><a href="mailto:${d.clientEmail}" style="color:#0d0d0d;">${d.clientEmail || '—'}</a></td></tr>
        <tr><td style="padding:7px 0;color:#999;vertical-align:top;">Adresse</td><td style="padding:7px 0;">${d.address || '—'}</td></tr>
      </table>
    </div>

    <div style="margin-bottom:40px;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;border-bottom:1px solid #f0f0f0;padding-bottom:14px;margin-bottom:18px;">05 — Features</div>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:220px;">Online-Terminbuchung</td><td style="padding:8px 0;">${yesNo(d.features?.booking)}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">WhatsApp-Button</td><td style="padding:8px 0;">${yesNo(d.features?.whatsapp)}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Kontaktformular</td><td style="padding:8px 0;">${yesNo(d.features?.contactForm)}</td></tr>
      </table>
    </div>

    <div style="background:#fafafa;border-radius:10px;padding:28px 28px 24px;">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#ccc;font-weight:600;margin-bottom:18px;">06 — Abschluss & Kontakt</div>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;width:220px;">Fertigstellungstermin</td><td style="padding:8px 0;">${d.deadline || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Ansprechpartner</td><td style="padding:8px 0;font-weight:600;">${d.contactName || '—'}</td></tr>
        <tr><td style="padding:8px 0;color:#999;">Rückmeldungs-E-Mail</td><td style="padding:8px 0;"><a href="mailto:${d.contactEmail}" style="color:#0d0d0d;">${d.contactEmail || '—'}</a></td></tr>
        <tr><td style="padding:8px 0;color:#999;vertical-align:top;">Sonstige Wünsche</td><td style="padding:8px 0;">${d.wishes || '—'}</td></tr>
      </table>
    </div>

  </div>

  <div style="background:#fafafa;border-top:1px solid #f0f0f0;padding:18px 44px;text-align:center;color:#ccc;font-size:11px;">
    Automatisch generiert &mdash; localoutput.com &mdash; Website Briefing Formular
  </div>
</div>
</body>
</html>`;
}

// ─── Email: Plain Text ─────────────────────────────────────────────────────────

function buildTextEmail(d) {
  const days = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
  const hoursObj = d.openingHours || {};

  return [
    '='.repeat(62),
    'NEUES BRIEFING — LOCALOUTPUT.COM',
    '='.repeat(62),
    '',
    '── 01 UNTERNEHMEN ──────────────────────────────────────────',
    `Unternehmensname:    ${d.companyName}`,
    `Branche:             ${d.industry}`,
    `Stadt:               ${d.city}`,
    `Besonderheit:        ${d.special || '(keine Angabe)'}`,
    `Website vorhanden:   ${d.hasWebsite ? 'Ja' : 'Nein'}`,
    '',
    '── 02 DESIGNSTIL ───────────────────────────────────────────',
    `>>> ${d.style || '(nicht gewählt)'} <<<`,
    '',
    '── 03 SECTIONS ─────────────────────────────────────────────',
    ...(d.sections || []).map(s => `  • ${s}`),
    '',
    '── 04 LEISTUNGEN ───────────────────────────────────────────',
    `${'Leistung'.padEnd(28)} ${'Preis'.padEnd(10)} Dauer`,
    '─'.repeat(52),
    ...(d.services || []).map(s =>
      `${(s.name || '').padEnd(28)} ${(s.price ? s.price + ' €' : '—').padEnd(10)} ${s.duration ? s.duration + ' Min' : '—'}`
    ),
    '',
    'Öffnungszeiten:',
    ...days.map(day => `  ${day.padEnd(12)}  ${hoursObj[day] || 'Geschlossen'}`),
    '',
    `Telefon:    ${d.phone || '(keine Angabe)'}`,
    `E-Mail:     ${d.clientEmail || '(keine Angabe)'}`,
    `Adresse:    ${d.address || '(keine Angabe)'}`,
    '',
    '── 05 FEATURES ─────────────────────────────────────────────',
    `Online-Terminbuchung:  ${d.features?.booking ? 'Ja' : 'Nein'}`,
    `WhatsApp-Button:       ${d.features?.whatsapp ? 'Ja' : 'Nein'}`,
    `Kontaktformular:       ${d.features?.contactForm ? 'Ja' : 'Nein'}`,
    '',
    '── 06 ABSCHLUSS ────────────────────────────────────────────',
    `Fertigstellungstermin: ${d.deadline || '(keine Angabe)'}`,
    `Ansprechpartner:       ${d.contactName || '(keine Angabe)'}`,
    `Rückmeldungs-E-Mail:   ${d.contactEmail || '(keine Angabe)'}`,
    `Sonstige Wünsche:      ${d.wishes || '(keine Angabe)'}`,
    '',
    '='.repeat(62),
    'localoutput.com — Website Briefing Formular',
  ].join('\n');
}

// ─── Route ────────────────────────────────────────────────────────────────────

app.post('/send-briefing', async (req, res) => {
  const data = req.body;

  if (!data.companyName || !data.city) {
    return res.status(400).json({ success: false, error: 'Pflichtfelder fehlen.' });
  }

  const subject = `Neues Briefing – ${data.companyName} (${data.industry || 'Sonstiges'}, ${data.city})`;

  try {
    await resend.emails.send({
      // WICHTIG: Absender-Domain muss in Resend verifiziert sein.
      // Für Tests: "onboarding@resend.dev" verwenden.
      from: 'Briefing <noreply@localoutput.com>',
      to: 'hallo@localoutput.com',
      replyTo: data.contactEmail || undefined,
      subject,
      html: buildHtmlEmail(data),
      text: buildTextEmail(data),
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Resend Fehler:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Briefing-Server läuft auf http://localhost:${PORT}`);
});
