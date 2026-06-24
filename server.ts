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
        strasseHausnummer,
        plz,
        ort,
        plzOrt,
        land,
        telefon,
        telefonMobil,
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

      const resolvedStrasse = strasseHausnummer || strasse || "-";
      const resolvedPlzOrt = (plz && ort) ? `${plz} ${ort}` : (plzOrt || "-");
      const resolvedTelefon = telefonMobil || telefon || "-";

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
Straße:           ${resolvedStrasse}
PLZ / Ort:        ${resolvedPlzOrt}
Land:             ${land || "-"}
Telefon:          ${resolvedTelefon}

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
      const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || "https://hook.eu2.make.com/kvu2sw7es80uu5i4e61s62hzajkqgo0p";

      let sentViaSmtp = false;
      let sentViaWebhook = false;

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
        sentViaSmtp = true;
      }

      // Check and dispatch to Make.com Webhook if defined
      if (makeWebhookUrl) {
        try {
          console.log(`Forwarding booking ${id} to Make.com Webhook...`);
          
          // Transform registration details so companions are embedded in the room objects
          const {
            zimmer: zimmerArray = [],
            mitreisende: mitreisendeArray = [],
            ...restOfRegistration
          } = registration;

          const transformedZimmer = zimmerArray.map((z: any, idx: number) => {
            const zimmerNummer = idx + 1;
            const rawTeilnehmer: any[] = [];

            // Rule 1: The main traveler belongs automatically to Room 1 (zimmerNummer: 1)
            if (zimmerNummer === 1) {
              if (registration.isHauptanmelderReisender !== false) {
                rawTeilnehmer.push({
                  vorname: registration.vorname || "",
                  nachname: registration.nachname || "",
                  geburtsdatum: registration.geburtsdatum || "",
                  isHauptanmelder: true
                });
              } else {
                rawTeilnehmer.push({
                  vorname: registration.abweichenderReisenderVorname || "",
                  nachname: registration.abweichenderReisenderNachname || "",
                  geburtsdatum: registration.abweichenderReisenderGeburtsdatum || "",
                  isHauptanmelder: false
                });
              }
            }

            // Rule 2: All mitreisende with zimmerIndex matching this room are assigned
            const roomCompanions = mitreisendeArray.filter((m: any) => {
              const compRoomIdx = m.zimmerIndex !== undefined ? Number(m.zimmerIndex) : 0;
              return compRoomIdx === idx;
            });

            roomCompanions.forEach((m: any) => {
              rawTeilnehmer.push({
                vorname: m.vorname || "",
                nachname: m.nachname || "",
                geburtsdatum: m.geburtsdatum || "",
                isHauptanmelder: false
              });
            });

            const teilnehmer = rawTeilnehmer.map((t: any) => {
              const vollerName = `${t.vorname} ${t.nachname}`.trim();
              let geburtsdatumFormatiert = t.geburtsdatum || "";
              if (geburtsdatumFormatiert && geburtsdatumFormatiert.includes("-")) {
                const parts = geburtsdatumFormatiert.split("-");
                if (parts.length === 3) {
                  geburtsdatumFormatiert = `${parts[2]}.${parts[1]}.${parts[0]}`;
                }
              }
              return {
                ...t,
                vollerName,
                geburtsdatumFormatiert
              };
            });

            const teilnehmerListeText = teilnehmer
              .map((t: any) => `• ${t.vollerName} (${t.geburtsdatumFormatiert})`)
              .join("\n");

            // Rule 4: Keep key fields on the room level
            return {
              zimmerNummer,
              zimmertyp: z.zimmertyp || registration.zimmertyp || "",
              abflughafen: registration.abflughafen === 'andere Flughäfen' ? (registration.abflughafenAnderer || registration.abflughafen) : (registration.abflughafen || ""),
              zahlungsart: registration.zahlungsart || "",
              flexOption: registration.flexOption || "",
              versicherungInfoBenoetigt: registration.versicherungInfoBenoetigt || "",
              teilnehmer,
              teilnehmerListeText
            };
          });

          const cleanRegistration = {
            ...restOfRegistration,
            zimmer: transformedZimmer
          };

          // Remove mitreisende and mitreisendeArray properties as requested
          delete (cleanRegistration as any).mitreisende;
          delete (cleanRegistration as any).mitreisendeArray;

          const makeResponse = await fetch(makeWebhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: id,
              subject,
              textContent,
              recipient: "info@artreisen.de",
              customerEmail: email,
              anmelder: {
                anrede,
                titel,
                vorname,
                nachname,
                email,
                strasse: resolvedStrasse,
                plzOrt: resolvedPlzOrt,
                land,
                telefon: resolvedTelefon,
              },
              buchungsdetails: cleanRegistration,
            }),
          });

          if (makeResponse.ok) {
            console.log(`Successfully dispatched payload to Make.com Webhook for booking ${id}`);
            sentViaWebhook = true;
          } else {
            console.error(`Received error status from Make.com Webhook: ${makeResponse.status}`);
          }
        } catch (webhookErr: any) {
          console.error("Failed to forward payload to Make.com Webhook:", webhookErr);
        }
      }

      if (!sentViaSmtp && !sentViaWebhook) {
        console.warn("SMTP configuration and MAKE_WEBHOOK_URL are both missing. Email content logged below:");
        console.log("-----------------------------------------");
        console.log(`TO: info@artreisen.de\nCC: ${email}\nSUBJECT: ${subject}\n\n${textContent}`);
        console.log("-----------------------------------------");
      }

      res.json({ 
        success: true, 
        methods: { 
          smtp: sentViaSmtp, 
          webhook: sentViaWebhook 
        } 
      });
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
