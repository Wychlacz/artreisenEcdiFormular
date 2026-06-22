import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Send email to info@artreisen.de
  app.post("/api/send-email", async (req, res) => {
    try {
      const { registration } = req.body;
      if (!registration) {
        return res.status(400).json({ success: false, error: "Fehlende Registrierungsdaten." });
      }

      const {
        id,
        anrede,
        titel,
        vorname,
        nachname,
        strasse,
        plzOrt,
        land,
        telefon,
        email,
        personenAnzahl,
        mitreisende,
        zimmer,
        abflughafen,
        abflughafenAnderer,
        flexOption,
        zahlungsart,
        zahlungIban,
        zahlungKontoinhaber,
        zahlungKreditkarteNummer,
        zahlungKreditkarteGueltig,
        zahlungKreditkarteInhaber,
        zusatzVerlaengerung,
        zusatzVerlaengerungText,
        zusatzBeachten,
        zusatzBeachtenText,
        zusatzSitzplatz,
        zusatzSitzplatzText,
        zusatzPrivatTransfer,
        zusatzTransferAuswahlPrivat,
        zusatzTransferAuswahlMietwagen,
        zusatzVersicherungAngebot,
        zusatzRailAndFly,
        agbKenntnis,
        pauschalreiseRichtlinien,
        versicherungInfoBenoetigt,
        createdAt,
        zimmerIndex,
        isFirmenrechnung,
        firmenName,
        firmenAnschrift,
        firmenAnsprechpartner,
        isHauptanmelderReisender,
        abweichenderReisenderAnrede,
        abweichenderReisenderVorname,
        abweichenderReisenderNachname,
        abweichenderReisenderGeburtsdatum,
      } = registration;

      const subject = `Neue Buchung ${id} - ${vorname} ${nachname} - ECDI Spring Camp`;

      let zimmerText = "";
      if (zimmer && zimmer.length > 0) {
        zimmerText = zimmer.map((z: any, idx: number) => {
          const mainRoomOccupant = zimmerIndex === idx;
          const occupants = [
            ...(mainRoomOccupant ? [isHauptanmelderReisender === false ? `${abweichenderReisenderVorname} ${abweichenderReisenderNachname} (Reisegast)` : `${vorname} ${nachname} (Haupt)`] : []),
            ...(mitreisende ? mitreisende.filter((m: any) => m.zimmerIndex === idx).map((m: any) => `${m.vorname} ${m.nachname}`) : [])
          ];
          const occupantsString = occupants.length > 0 ? ` [Belegt durch: ${occupants.join(", ")}]` : " [Keine Personen zugewiesen]";
          return `  * Zimmer ${idx + 1}: ${z.zimmertyp} für ${z.gaesteAnzahl} Person(en)${occupantsString}`;
        }).join("\n");
      } else {
        zimmerText = `  * ${registration.zimmertyp || "Keine Zimmerauswahl"}`;
      }

      let mitreisendeText = "";
      if (mitreisende && mitreisende.length > 0) {
        mitreisendeText = mitreisende.map((m: any, idx: number) => {
          const roomAssigned = zimmer && zimmer.length > 1
            ? ` (Zugeordnet: Zimmer ${m.zimmerIndex !== undefined ? m.zimmerIndex + 1 : 1})`
            : "";
          return `  * Mitreisende(r) ${idx + 2}: ${m.vorname} ${m.nachname} (Geb.: ${m.geburtsdatum})${roomAssigned}`;
        }).join("\n");
      } else {
        mitreisendeText = "  Keine Mitreisenden";
      }

      const textContent = `
BUCHUNGSBESTÄTIGUNG / NEUE REGISTRIERUNG
-------------------------------------------------------------------------
Buchungs-ID:      ${id}
Eingangsdatum:    ${new Date(createdAt).toLocaleString("de-DE")}

KONTAKTDATEN DES ANMELDERS (BUCHUNGSPERSON):
-------------------------------------------------------------------------
Anrede:           ${anrede || "-"}
Titel:            ${titel || "-"}
Name:             ${vorname} ${nachname}
E-Mail:           ${email}
Straße:           ${strasse || "-"}
PLZ / Ort:        ${plzOrt || "-"}
Land:             ${land || "-"}
Telefon:          ${telefon || "-"}

TATSÄCHLICHER REISEGAST FÜR ZIMMER 1:
-------------------------------------------------------------------------
Hauptanmelder reist selbst? ${isHauptanmelderReisender === false ? "Nein (Abweichender Reisegast für Zimmer 1 wie folgt)" : "Ja"}
${isHauptanmelderReisender === false ? `Name:             ${abweichenderReisenderAnrede || ""} ${abweichenderReisenderVorname || ""} ${abweichenderReisenderNachname || ""}
Geburtsdatum:     ${abweichenderReisenderGeburtsdatum || "-"}` : ""}

FIRMENRECHNUNG (Optional):
-------------------------------------------------------------------------
Firmenrechnung?   ${isFirmenrechnung ? "Ja" : "Nein"}
${isFirmenrechnung ? `Firmenname:       ${firmenName || "-"}
Firmenanschrift:  ${firmenAnschrift || "-"}
Ansprechpartner:  ${firmenAnsprechpartner || "Identisch mit Hauptreisendem"}` : ""}

REISETERMDETAILS & FLUG:
-------------------------------------------------------------------------
Anzahl Reisende:  ${personenAnzahl} Person(en) insgesamt
Abflughafen:      ${abflughafen === 'andere Flughäfen' ? abflughafenAnderer : abflughafen}

ZIMMER- / UNTERBRINGUNGSPLANUNG:
-------------------------------------------------------------------------
Wieviele Zimmer:  ${zimmer ? zimmer.length : 1} Zimmer
Zimmer-Details:
${zimmerText}

MITREISENDE GÄSTE:
-------------------------------------------------------------------------
${mitreisendeText}

ZUSATZLEISTUNGEN & VERLÄNGERUNGEN:
-------------------------------------------------------------------------
- Flexoption (59 €):                  ${flexOption || "Nein"}
- Verlängerungswunsch:               ${zusatzVerlaengerung ? `Ja (${zusatzVerlaengerungText})` : "Nein"}
- Dinge zu beachten (Wünsche etc):   ${zusatzBeachten ? `Ja (${zusatzBeachtenText})` : "Nein"}
- Sitzplatzwunsch:                   ${zusatzSitzplatz ? `Ja (${zusatzSitzplatzText})` : "Nein"}
- Privat-Transfer / Mietwagen:        ${zusatzPrivatTransfer ? `Ja (${[zusatzTransferAuswahlPrivat && 'Privattransfer', zusatzTransferAuswahlMietwagen && 'Mietwagen'].filter(Boolean).join(' + ')})` : "Nein"}
- Reiserücktritts-Versicherungsangebot: ${zusatzVersicherungAngebot ? "Ja, gewünscht" : "Nein"}
- Rail & Fly (Zug-zum-Flug):         ${zusatzRailAndFly ? "Ja, gewünscht" : "Nein"}

ZAHLUNGSINFORMATIONEN:
-------------------------------------------------------------------------
- Gewählte Zahlungsart:               ${zahlungsart || "Keine Angabe"}
${zahlungsart === "Lastschrift" ? `- Kontoinhaber:                      ${zahlungKontoinhaber || '-'}\n- IBAN:                             ${zahlungIban || '-'}` : ""}${zahlungsart === "Kreditkarte" ? `- Karteninhaber:                    ${zahlungKreditkarteInhaber || '-'}\n- Kreditkartennummer:               ${zahlungKreditkarteNummer ? 'xxxxxxxxxxxx' + zahlungKreditkarteNummer.slice(-4) : '(Wird telefonisch durchgegeben)'}\n- Gültig bis:                       ${zahlungKreditkarteGueltig || '-'}` : ""}

GESETZLICHE BESTÄTIGUNGEN:
-------------------------------------------------------------------------
- AGB des Veranstalters akzeptiert:   ${agbKenntnis || "Nein"}
- Pauschalreiserichtlinien gelesen:   ${pauschalreiseRichtlinien || "Nein"}
- Reiseversicherung Info benötigt:    ${versicherungInfoBenoetigt || "Nein"}
`;

      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpFrom = process.env.SMTP_FROM || "booking@artreisen.de";

      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: "info@artreisen.de",
          cc: email,
          subject: subject,
          text: textContent,
        });

        console.log(`Email successfully sent for booking ${id} to info@artreisen.de`);
      } else {
        console.warn("SMTP configuration is missing. Email content logged below:");
        console.log("-----------------------------------------");
        console.log(`TO: info@artreisen.de\nCC: ${email}\nSUBJECT: ${subject}\n\n${textContent}`);
        console.log("-----------------------------------------");
      }

      res.json({ success: true });
    } catch (err: any) {
      console.error("Error sending email:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
