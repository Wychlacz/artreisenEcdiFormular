import React from 'react';
import { Registration } from '../types';
import { motion } from 'motion/react';
import { 
  CheckCircle, Plane, Download, Mail, Calendar, MapPin, Check, 
  ArrowLeft, Heart, Sparkles, ShieldCheck, HelpCircle
} from 'lucide-react';

interface ConfirmationScreenProps {
  registration: Registration;
  onReset: () => void;
}

export default function ConfirmationScreen({
  registration,
  onReset
}: ConfirmationScreenProps) {
  
  // Reisedaten TXT herunterladen
  const downloadReceipt = () => {
    const textData = `
=========================================
      BUCHUNGSBESTÄTIGUNG - ART REISEN
=========================================
Buchungsnummer:   ${registration.id}
Datum der Buchung: ${new Date(registration.createdAt).toLocaleDateString('de-DE')}
Reiseleistung:    Reisearrangement ECDI Fuerteventura
Reiseveranstalter: Reisebüro Art Reisen, Inh. S. Artmann

HAUPTREISENDER:
-----------------------------------------
Anrede:           ${registration.anrede}
Name:             ${registration.vorname} ${registration.nachname}
Geburtsdatum:     ${registration.geburtsdatum}
Adresse:          ${registration.strasseHausnummer}
                  ${registration.plz} ${registration.ort} (${registration.land})
Telefon (Mobil):  ${registration.telefonMobil}
E-Mail:           ${registration.email}

REISENDE INSGESAMT: ${registration.personenAnzahl} Person(en)
Hauptreisender:      ${registration.anrede} ${registration.vorname} ${registration.nachname} (Geb.: ${registration.geburtsdatum})${registration.zimmer && registration.zimmer.length > 1 ? ` [Zugeordnetes Zimmer: Zimmer ${registration.zimmerIndex !== undefined ? registration.zimmerIndex + 1 : 1}]` : ''}
${registration.mitreisende.length > 0 ? `
MITREISENDE PERSONEN:
-----------------------------------------
${registration.mitreisende.map((mr, i) => `${i + 2}. Person: ${mr.vorname} ${mr.nachname} (Geb.: ${mr.geburtsdatum})${registration.zimmer && registration.zimmer.length > 1 ? ` [Zugeordnetes Zimmer: Zimmer ${mr.zimmerIndex !== undefined ? mr.zimmerIndex + 1 : 1}]` : ''}`).join('\n')}` : ''}

REISE- & UNTERBRINGUNGSDETAILS:
-----------------------------------------
Abflughafen:      ${registration.abflughafen === 'andere Flughäfen' ? registration.abflughafenAnderer : registration.abflughafen}
${registration.zimmer && registration.zimmer.length > 0 ? `Zimmer-Aufteilung:
${registration.zimmer.map((z, idx) => `  * Zimmer ${idx+1}: ${z.zimmertyp} (${z.gaesteAnzahl} Person(en))` + (registration.zimmer && registration.zimmer.length > 1 ? ` - Belegt durch: ${[
  ...(registration.zimmerIndex === idx ? [`${registration.vorname} ${registration.nachname}`] : []),
  ...registration.mitreisende.filter(m => m.zimmerIndex === idx).map(m => `${m.vorname} ${m.nachname}`)
].join(', ') || 'Keine Angabe'}` : '')).join('\n')}` : `Zimmertyp:        ${registration.zimmertyp}`}

ZUSATZLEISTUNGEN & SONDERWÜNSCHE:
-----------------------------------------
Urlaub verlängern: ${registration.zusatzVerlaengerung ? `Ja (${registration.zusatzVerlaengerungText})` : 'Nein'}
Dinge beachten:    ${registration.zusatzBeachten ? `Ja (${registration.zusatzBeachtenText})` : 'Nein'}
Besserer Sitzplatz:${registration.zusatzSitzplatz ? `Ja (${registration.zusatzSitzplatzText})` : 'Nein'}
Privat-Transfer:   ${registration.zusatzPrivatTransfer ? 'Ja' : 'Nein'}
Versicherungsangebot requested: ${registration.zusatzVersicherungAngebot ? 'Ja' : 'Nein'}
Rail & Fly:        ${registration.zusatzRailAndFly ? 'Ja' : 'Nein'}

WICHTIGE ERKLÄRUNGEN:
-----------------------------------------
AGB zur Kenntnis genommen:               ${registration.agbKenntnis}
Pauschalreiserichtlinien informiert:    ${registration.pauschalreiseRichtlinien}
Rücktrittskostenversicherung Info benö-
tigt:                                    ${registration.versicherungInfoBenoetigt}
Flexoption abschließen (59,- €):         ${registration.flexOption}
DSGVO-Einverständnis erteilt:           Ja

Vielen Dank für Ihr Vertrauen in über 30 Jahre Erfahrung!
Reisebüro Art Reisen
    `;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `art_reisen_buchung_${registration.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // E-Mail templates
  const emailToUser = `
Sehr geehrte/r ${registration.anrede === 'Herr' ? 'Herr' : registration.anrede === 'Frau' ? 'Frau' : ''} ${registration.nachname},

vielen Dank für Ihre Buchungsanfrage bei Art Reisen zur Fuerteventura-Reise!
Wir freuen uns sehr über Ihre Nachricht. Die Buchungsreferenz lautet: ${registration.id}

Hier ist eine Übersicht Ihrer Reiseanmeldung:
-------------------------------------------------------------------------
- Anzahl Reisende: ${registration.personenAnzahl} Person(en)
- Abflughafen: ${registration.abflughafen === 'andere Flughäfen' ? registration.abflughafenAnderer : registration.abflughafen}
- Gebuchte Zimmer:
${registration.zimmer && registration.zimmer.length > 0 ? registration.zimmer.map((z, idx) => `  * Zimmer ${idx+1}: ${z.zimmertyp} (${z.gaesteAnzahl} Person(en))`).join('\n') : `  * ${registration.zimmertyp}`}
- Flexoption (59 Euro): ${registration.flexOption}
- Gewünschte Zusatzleistungen:
  ${registration.zusatzVerlaengerung ? `* Verlängerungswunsch: ${registration.zusatzVerlaengerungText}` : ''}
  ${registration.zusatzBeachten ? `* Wichtige Hinweise: ${registration.zusatzBeachtenText}` : ''}
  ${registration.zusatzSitzplatz ? `* Sitzplatz: ${registration.zusatzSitzplatzText}` : ''}
  ${registration.zusatzPrivatTransfer ? `* Privat-Transfer erwünscht` : ''}
  ${registration.zusatzVersicherungAngebot ? `* Allianz Rücktrittsversicherungsangebot erwünscht` : ''}
  ${registration.zusatzRailAndFly ? `* Rail & Fly (Zug-zum-Flug) Angebot erwünscht` : ''}
-------------------------------------------------------------------------

Nächste Schritte:
1. Unser Team prüft unverzüglich die Flug- und Hotelkontingente entsprechend Ihrer Wünsche.
2. In Kürze erhalten Sie Ihre verbindliche Buchungsbestätigung mit der gesetzlichen Insolvenzsicherung (Sicherungsschein) sowie der Rechnung direkt per E-Mail zugestellt.
3. Ggf. senden wir Ihnen die optionalen Angebote für Ihre gewünschten Zusatzleistungen (Sitzplätze, Rail & Fly etc.) zu.

Bei Rückfragen stehen wir Ihnen jederzeit unter +49 (0) 89 123456-0 oder unter info@art-reisen.de zur Verfügung.

Herzliche Grüße aus München,

Sabine Artmann & das Team von Art Reisen
Inhabergeführt seit über 30 Jahren.
  `;

  return (
    <div className="max-w-4xl mx-auto space-y-8" id="confirmation-screen-root">
      
      {/* Thank you circle */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-2">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-brand-dark-brown">
          Anmeldung erfolgreich übertragen!
        </h2>
        <p className="text-gray-500 font-sans max-w-xl mx-auto text-sm">
          Vielen Dank, <strong>{registration.vorname} {registration.nachname}</strong>. Ihre Anfrage wird nun von unserem Team erfasst. Wir haben soeben eine Bestätigung an Ihre E-Mail <strong>{registration.email}</strong> gesendet.
        </p>
      </div>

      {/* Ticket visual */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl border border-brand-gray overflow-hidden shadow-xl"
        id="travel-ticket-card"
      >
        <div className="bg-brand-dark-brown text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
          <div>
            <span className="text-[10px] uppercase font-bold text-brand-yellow font-display tracking-widest bg-white/10 px-2.5 py-0.5 rounded-full">
              Art Reisen — Buchungsanfrage
            </span>
            <h3 className="text-lg font-display font-black mt-1">Reise Fuerteventura</h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-300 font-display uppercase tracking-wider block">ID-Referenz</span>
            <span className="text-xl font-mono font-black text-brand-yellow tracking-wider">{registration.id}</span>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-linear-to-b from-white to-brand-light-bg/10">
          
          {/* Main Info Columns */}
          <div className="space-y-4 md:col-span-2 border-r-0 md:border-r border-brand-gray border-dashed pr-0 md:pr-6 font-sans">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Anmelder / Hauptreisender</span>
                <span className="font-display font-extrabold text-sm text-brand-dark-brown">
                  {registration.anrede} {registration.vorname} {registration.nachname}
                </span>
                <span className="block text-gray-400 text-[10px]">{registration.email}</span>
                {registration.zimmer && registration.zimmer.length > 1 && (
                  <span className="block text-brand-orange text-[10px] font-bold mt-0.5">
                    Zugewiesen: Zimmer {registration.zimmerIndex !== undefined ? registration.zimmerIndex + 1 : 1}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Unterkunft / Belegung</span>
                {registration.zimmer && registration.zimmer.length > 0 ? (
                  <div className="space-y-0.5 mt-0.5 font-sans">
                    {registration.zimmer.map((z, idx) => (
                      <div key={idx} className="text-[10px] font-semibold text-brand-dark-brown leading-tight">
                        Z{idx+1}: {z.gaesteAnzahl}P ({z.zimmertyp})
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="font-display font-extrabold text-sm text-brand-dark-brown">
                    {registration.zimmertyp}
                  </span>
                )}
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Abflughafen</span>
                <span className="font-display font-semibold text-xs text-brand-blue">
                  {registration.abflughafen === 'andere Flughäfen' ? registration.abflughafenAnderer : registration.abflughafen}
                </span>
              </div>

              <div>
                <span className="text-gray-400 block font-medium">Gesamtpersonen</span>
                <span className="font-display font-semibold text-xs text-brand-dark-brown">
                  {registration.personenAnzahl} Person(en)
                </span>
              </div>
            </div>

            {/* Companions listing */}
            {registration.mitreisende.length > 0 && (
              <div className="bg-brand-light-bg/50 p-3 rounded-xl border border-brand-gray/80 space-y-1.5">
                <span className="text-[10px] font-bold text-brand-dark-brown block uppercase tracking-wider">Mitreisende Personen:</span>
                <div className="space-y-1">
                  {registration.mitreisende.map((mr, idx) => (
                    <div key={idx} className="text-xs flex flex-row justify-between items-center text-gray-600 bg-white p-2 rounded border border-brand-gray/30 gap-2">
                      <div className="flex flex-col">
                        <span><strong>{mr.vorname} {mr.nachname}</strong></span>
                        {registration.zimmer && registration.zimmer.length > 1 && (
                          <span className="text-[10px] text-brand-orange font-bold">
                            Zugewiesen: Zimmer {mr.zimmerIndex !== undefined ? mr.zimmerIndex + 1 : 1}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400">Geb.: {new Date(mr.geburtsdatum).toLocaleDateString('de-DE')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services row */}
            <div className="bg-white/90 border border-brand-gray/80 p-3.5 rounded-xl space-y-1.5 text-xs">
              <span className="font-display font-bold text-brand-dark-brown block uppercase tracking-wider text-[10px]">Gewünschte Zusatzleistungen:</span>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-medium text-gray-600">
                <li className="flex items-center gap-1.5">
                  <span className={registration.zusatzVerlaengerung ? 'text-emerald-600' : 'text-gray-300'}>✓</span>
                  Verlängerungswunsch: {registration.zusatzVerlaengerung ? 'Ja' : 'Nein'}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={registration.zusatzBeachten ? 'text-emerald-600' : 'text-gray-300'}>✓</span>
                  Dinge beachten: {registration.zusatzBeachten ? 'Ja' : 'Nein'}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={registration.zusatzSitzplatz ? 'text-emerald-600' : 'text-gray-300'}>✓</span>
                  Sitzplatzwunsch: {registration.zusatzSitzplatz ? 'Ja' : 'Nein'}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className={registration.zusatzPrivatTransfer ? 'text-emerald-600' : 'text-gray-300'}>✓</span>
                  Privat-Transfer: {registration.zusatzPrivatTransfer ? 'Ja' : 'Nein'}
                </li>
                <li className="flex items-center gap-1.5 col-span-2 mt-1 pt-1 border-t border-brand-gray/50">
                  🛡️ Flexoption gebucht für 59,- €: <strong className={registration.flexOption === 'Ja' ? 'text-emerald-600 ml-1' : 'text-gray-500 ml-1'}>{registration.flexOption}</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Action columns */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-gray-400 block font-sans">Sicherheit & Gesetz</span>
              <div className="space-y-1 text-[10px] text-gray-500 leading-normal">
                <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0 bg-emerald-100 rounded-full p-0.5" /> AGBs akzeptiert
                </p>
                <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0 bg-emerald-100 rounded-full p-0.5" /> Pauschalreiseinfo erfolgt
                </p>
                <p className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3.5 h-3.5 shrink-0 bg-emerald-100 rounded-full p-0.5" /> DSGVO zugestimmt
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-gray/80">
              <button
                onClick={downloadReceipt}
                id="receipt-download-btn"
                className="w-full flex items-center justify-center gap-2 bg-brand-dark-green hover:bg-brand-dark-green/90 text-white font-display font-semibold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                Zusammenfassung (TXT)
              </button>
            </div>
          </div>

        </div>

        {/* Footer info banner */}
        <div className="bg-brand-light-bg/60 border-t border-brand-gray border-dashed px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 font-sans">
          <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-brand-orange fill-brand-orange" /> Inhabergeführter Service für Ihre Traumreise</span>
          <span>Insolvenzschutz gemäß BGB inklusive.</span>
        </div>
      </motion.div>

      {/* Simulated Email */}
      <div className="bg-white rounded-2xl border border-brand-gray p-6 shadow-md space-y-4" id="simulated-mail-flow">
        <div className="border-b border-brand-gray pb-3">
          <h3 className="text-md font-display font-bold text-brand-dark-brown flex items-center gap-2">
            <Mail className="w-5 h-5 text-brand-orange" />
            Vorschau der generierten E-Mail-Übertragung
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-sans">
            Als Bestätigung haben wir vorbereitet:
          </p>
        </div>

        <div className="space-y-2 font-sans">
          <span className="text-xs font-bold text-brand-dark-brown flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-brand-blue rounded-full" /> 
            An den Kunden ({registration.email})
          </span>
          <div className="bg-brand-light-bg/50 p-4 rounded-xl border border-brand-gray/60 font-mono text-[10px] leading-relaxed text-gray-600 max-h-[220px] overflow-y-auto whitespace-pre-wrap">
            {emailToUser.trim()}
          </div>
        </div>
      </div>

      {/* Reset return button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 font-display font-semibold text-xs cursor-pointer border border-brand-blue/20 hover:bg-brand-blue/5 px-5 py-2.5 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Neue Buchungsanfrage starten
        </button>
      </div>

    </div>
  );
}
