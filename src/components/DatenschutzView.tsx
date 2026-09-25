import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Database, Clock, Users, CreditCard, Scale, ExternalLink } from 'lucide-react';

interface DatenschutzViewProps {
  onBack: () => void;
}

export default function DatenschutzView({ onBack }: DatenschutzViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-brand-dark-text" id="datenschutz-page-view">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-white border border-brand-gray/80 text-brand-dark-brown hover:bg-gray-50 text-xs font-display font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Reiseanmeldung
        </button>
        <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Datenschutz nach Art. 13 & 14 DSGVO
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-brand-gray/80 p-6 md:p-10 shadow-xl space-y-8">
        <div className="border-b border-brand-gray pb-6">
          <div className="flex items-center gap-2 text-emerald-700 mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs uppercase font-display font-extrabold tracking-widest">
              Reisebüro art reisen GmbH
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-brand-dark-brown">
            Datenschutzerklärung
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Informationen über die Verarbeitung personenbezogener Daten bei der Reiseanmeldung gemäß Art. 13 und 14 der EU-Datenschutz-Grundverordnung (DSGVO)
          </p>
        </div>

        {/* 1. Verantwortlicher */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">1</span>
            Name und Kontaktdaten des Verantwortlichen
          </h2>
          <div className="bg-brand-light-bg/60 p-4 rounded-xl border border-brand-gray/70 text-xs text-gray-700 leading-relaxed space-y-1">
            <p className="font-bold text-brand-dark-brown text-sm">Reisebüro art reisen GmbH</p>
            <p>Mühlenstraße 21–23, 40822 Mettmann, Deutschland</p>
            <p>Telefon: 02104 75711 (bzw. +49 2104 75711)</p>
            <p>E-Mail: <a href="mailto:info@artreisen.de" className="text-brand-blue underline font-bold">info@artreisen.de</a></p>
            <p>Website: <a href="https://artreisen.de" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline">www.artreisen.de</a></p>
          </div>
        </section>

        {/* 2. Rechtsgrundlage: Vertragserfüllung statt Einwilligung */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">2</span>
            Zwecke der Verarbeitung & Rechtsgrundlagen (Art. 6 Abs. 1 lit. b DSGVO)
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed space-y-3">
            <div className="bg-brand-blue/5 border border-brand-blue/20 p-4 rounded-xl">
              <strong className="text-brand-blue block text-xs mb-1">
                Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):
              </strong>
              Die von Ihnen im Anmeldeformular eingegebenen personenbezogenen Daten (Name, Vorname, Geburtsdatum, Anschrift, E-Mail-Adresse, Telefonnummer, Zimmer- und Flugpräferenzen sowie Daten der Mitreisenden) sind für den Abschluss und die ordnungsgemäße Durchführung des Reisevertrags sowie vorvertraglicher Maßnahmen (Bearbeitung Ihrer Buchungsanfrage, Ausstellung von Flugtickets und Hotelreservierung) zwingend erforderlich.
            </div>
            <p>
              Es handelt sich hierbei um eine <strong>vertragliche Erforderlichkeit</strong> gemäß Art. 6 Abs. 1 lit. b DSGVO. Die Bestätigung im Formular dient Ihrer transparenten <strong>Kenntnisnahme</strong> über diesen Verarbeitungszweck.
            </p>
            <p>
              Soweit gesetzliche Aufbewahrungspflichten bestehen (z. B. steuer- und handelsrechtliche Aufbewahrung von Buchungsbelegen), erfolgt die Verarbeitung zusätzlich auf Grundlage von <strong>Art. 6 Abs. 1 lit. c DSGVO</strong> in Verbindung mit § 257 HGB und § 147 AO.
            </p>
          </div>
        </section>

        {/* 3. Schutz von Zahlungsdaten & PCI-DSS */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">3</span>
            Zahlungsdaten & Konformität mit dem PCI-DSS Sicherheitsstandard
          </h2>
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <CreditCard className="w-4 h-4 text-amber-700" />
              Keine Übertragung von Kreditkartendaten über Webformulare oder E-Mails
            </div>
            <p>
              Zum Schutz Ihrer finanziellen Daten und zur vollständigen Einhaltung der internationalen Sicherheitsstandards der Kreditkartenindustrie (<strong>PCI-DSS</strong>) werden über dieses Online-Formular <strong>niemals sensible Kreditkartendaten</strong> (wie Kartennummern, Gültigkeitsdaten oder Prüfziffern / CVV) erhoben, gespeichert oder per Webhook bzw. unverschlüsselter E-Mail übermittelt.
            </p>
            <p>
              Wenn Sie als Zahlungsart „Kreditkarte“ wählen, erfolgt die Übergabe der Kartendaten sicher <strong>telefonisch</strong> direkt an das autorisierte Personal der art reisen GmbH (unter 02104 75711) oder auf Wunsch über einen gesicherten, PCI-DSS-zertifizierten Zahlungslink eines lizenzierten Zahlungsdienstleisters.
            </p>
          </div>
        </section>

        {/* 4. Empfänger & Auftragsverarbeitung */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">4</span>
            Empfänger der Daten & Auftragsverarbeitung (Art. 28 DSGVO)
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed space-y-2">
            <p>
              Ihre Daten werden streng vertraulich behandelt und ausschließlich an Stellen weitergegeben, die zur Erfüllung des Reisevertrags zwingend eingebunden sind:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Make.com (Celonis Inc. / Integromat s.r.o.):</strong> Zur technischen Automatisierung und verschlüsselten Übermittlung Ihrer Buchungsanfrage an die art reisen GmbH nutzen wir die Plattform Make.com als <strong>Auftragsverarbeiter</strong>. Mit dem Anbieter wurde ein gesetzeskonformer Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO abgeschlossen.
              </li>
              <li>
                <strong>Beteiligte Leistungsträger:</strong> Fluggesellschaften (zur Erstellung der Flugtickets), Hotelbetriebe (zur Reservierung der gebuchten Zimmerkategorien) sowie ggf. Transferdienstleister und Insolvenzversicherer.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Keine externen Web-Fonts (Google Fonts) */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">5</span>
            Keine Einbindung externer Web-Fonts (Google Fonts)
          </h2>
          <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl text-xs text-gray-700 leading-relaxed space-y-1">
            <p className="font-bold text-emerald-950">
              Vollständiger Verzicht auf externe Schriftartenserver:
            </p>
            <p>
              Diese Anwendung bindet <strong>keine externen Web-Schriftarten (wie Google Fonts)</strong> ein. Sämtliche Typografien werden als native System-Schriftarten (System Fonts) direkt und sicher von Ihrem Betriebssystem bzw. Endgerät geladen. Dadurch findet zu keinem Zeitpunkt eine Übertragung Ihrer IP-Adresse oder sonstiger Verbindungsdaten an Server von Drittanbietern (z.&nbsp;B. Google) zum Laden von Schriftarten statt.
            </p>
          </div>
        </section>

        {/* 6. Speicherdauer & Löschfristen */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">6</span>
            Speicherdauer & Löschfristen (Art. 13 Abs. 2 lit. a DSGVO)
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed space-y-2">
            <p>
              Wir verarbeiten und speichern Ihre personenbezogenen Daten nur so lange, wie es für die Durchführung der gebuchten Reise erforderlich ist:
            </p>
            <div className="bg-brand-light-bg/50 p-3 rounded-lg border border-brand-gray/60 space-y-1">
              <p>
                ⏱️ <strong>Operative Anfragedaten:</strong> Operative Daten und Buchungsanfragen im internen System werden <strong>3 Monate nach Abschluss der Reise</strong> routinemäßig gelöscht bzw. vollständig anonymisiert.
              </p>
              <p>
                ⚖️ <strong>Gesetzliche Aufbewahrungspflichten:</strong> Handels- und steuerrechtliche Buchungs- und Rechnungsbelege werden gemäß § 257 HGB und § 147 AO für einen Zeitraum von 6 bis 10 Jahren aufbewahrt und anschließend vernichtet.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Drittdaten von Mitreisenden */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">7</span>
            Angabe von Drittdaten (Mitreisende)
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed">
            Wenn Sie als Hauptanmelder Daten mitreisender Personen (wie Vor- und Nachname oder Geburtsdaten) in das Formular eingeben, bestätigen Sie, dass Sie hierzu im Auftrag und mit Wissen der betroffenen Personen berechtigt sind und diese über den Inhalt dieser Datenschutzerklärung in Kenntnis gesetzt haben.
          </p>
        </section>

        {/* 8. Betroffenenrechte */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">8</span>
            Ihre Rechte als betroffene Person (Art. 15–21 DSGVO)
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed space-y-2">
            <p>Sie haben gegenüber dem Verantwortlichen folgende gesetzliche Rechte:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Auskunftsrecht (Art. 15 DSGVO)</strong>
                Sie können Auskunft über Ihre von uns verarbeiteten Daten verlangen.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Berichtigungsrecht (Art. 16 DSGVO)</strong>
                Sie können die unverzügliche Berichtigung unrichtiger Daten verlangen.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Löschungsrecht (Art. 17 DSGVO)</strong>
                Sie können die Löschung Ihrer bei uns gespeicherten Daten verlangen („Recht auf Vergessenwerden“).
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Einschränkung der Verarbeitung (Art. 18 DSGVO)</strong>
                Sie können die Einschränkung der Datenverarbeitung verlangen.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Datenübertragbarkeit (Art. 20 DSGVO)</strong>
                Sie haben das Recht, Ihre Daten in einem maschinenlesbaren Format zu erhalten.
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <strong className="block text-brand-dark-brown">Widerspruchsrecht (Art. 21 DSGVO)</strong>
                Sie können der Datenverarbeitung aus Gründen Ihrer besonderen Situation widersprechen.
              </div>
            </div>
            <p className="pt-1">
              Zur Ausübung Ihrer Rechte genügt eine formlose Mitteilung per E-Mail an{' '}
              <a href="mailto:info@artreisen.de" className="text-brand-blue underline font-bold">info@artreisen.de</a>.
            </p>
          </div>
        </section>

        {/* 9. Beschwerderecht */}
        <section className="space-y-3">
          <h2 className="font-display font-black text-sm uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-mono">9</span>
            Beschwerderecht bei der zuständigen Aufsichtsbehörde (Art. 77 DSGVO)
          </h2>
          <div className="text-xs text-gray-700 leading-relaxed bg-brand-light-bg/50 p-4 rounded-xl border border-brand-gray/60 space-y-1">
            <p>
              Im Falle datenschutzrechtlicher Verstöße steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu:
            </p>
            <p className="font-bold text-brand-dark-brown">
              Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW)
            </p>
            <p>Kavalleriestraße 2–4, 40213 Düsseldorf</p>
            <p>
              Website:{' '}
              <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline font-bold inline-flex items-center gap-1">
                www.ldi.nrw.de
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="pt-6 border-t border-brand-gray flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-display font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Reiseanmeldung
          </button>
          <a
            href="https://artreisen.de/datenschutz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-brand-blue underline inline-flex items-center gap-1"
          >
            Datenschutzerklärung auf artreisen.de
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
