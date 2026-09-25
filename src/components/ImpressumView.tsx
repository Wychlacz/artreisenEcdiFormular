import React from 'react';
import { ArrowLeft, Building2, Phone, Mail, Globe, Shield, Scale, ExternalLink } from 'lucide-react';

interface ImpressumViewProps {
  onBack: () => void;
}

export default function ImpressumView({ onBack }: ImpressumViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-brand-dark-text" id="impressum-page-view">
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
        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
          Gesetzliche Anbieterkennzeichnung (§ 5 DDG / TMG)
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-brand-gray/80 p-6 md:p-10 shadow-xl space-y-8">
        <div className="border-b border-brand-gray pb-6">
          <div className="flex items-center gap-2.5 text-brand-blue mb-2">
            <Building2 className="w-6 h-6" />
            <span className="text-xs uppercase font-display font-extrabold tracking-widest text-brand-blue">
              Reisebüro art reisen GmbH
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-brand-dark-brown">
            Impressum & Pflichterklärungen
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Offizielle Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 MStV
          </p>
        </div>

        {/* Grid of details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Anschrift & Betreiber */}
          <div className="bg-brand-light-bg/50 p-5 rounded-xl border border-brand-gray/70 space-y-2">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-blue" />
              Angaben gemäß § 5 DDG
            </h2>
            <div className="text-xs space-y-1 text-gray-700 leading-relaxed">
              <p className="font-bold text-brand-dark-brown text-sm">Reisebüro art reisen GmbH</p>
              <p>Mühlenstraße 21–23</p>
              <p>40822 Mettmann</p>
              <p>Deutschland</p>
            </div>
          </div>

          {/* Box 2: Kontakt */}
          <div className="bg-brand-light-bg/50 p-5 rounded-xl border border-brand-gray/70 space-y-2">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-blue" />
              Kontaktmöglichkeiten
            </h2>
            <div className="text-xs space-y-1 text-gray-700 leading-relaxed">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Telefon: <strong>02104 75711</strong> (bzw. +49 2104 75711)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>E-Mail: <a href="mailto:info@artreisen.de" className="text-brand-blue underline font-bold">info@artreisen.de</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>Website: <a href="https://artreisen.de" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline font-bold">www.artreisen.de</a></span>
              </p>
            </div>
          </div>

          {/* Box 3: Register & USt */}
          <div className="bg-brand-light-bg/50 p-5 rounded-xl border border-brand-gray/70 space-y-2">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand-blue" />
              Handelsregister & Umsatzsteuer
            </h2>
            <div className="text-xs space-y-1 text-gray-700 leading-relaxed">
              <p><strong>Registergericht:</strong> Amtsgericht Wuppertal</p>
              <p><strong>Geschäftsführung:</strong> Reisebüro art reisen GmbH</p>
              <p><strong>Umsatzsteuer-Identifikationsnummer</strong> gemäß § 27a Umsatzsteuergesetz (UStG):</p>
              <p className="font-mono font-bold text-brand-dark-brown text-sm">DE119423766</p>
            </div>
          </div>

          {/* Box 4: Insolvenzschutz & Reiserecht */}
          <div className="bg-brand-light-bg/50 p-5 rounded-xl border border-brand-gray/70 space-y-2">
            <h2 className="font-display font-black text-xs uppercase tracking-wider text-brand-dark-brown flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Insolvenzschutz & Reiseveranstalter
            </h2>
            <div className="text-xs space-y-1 text-gray-700 leading-relaxed">
              <p>
                Die Reisebüro art reisen GmbH vermittelt und veranstaltet Reisen im Sinne des Bürgerlichen Gesetzbuches (BGB).
              </p>
              <p className="text-emerald-800 font-medium">
                ✓ Alle Kundengelder sind gemäß § 651r BGB gesetzlich insolvenzversichert. Ein Sicherungsschein wird mit der Reisebestätigung übermittelt.
              </p>
            </div>
          </div>
        </div>

        {/* Streitbeilegung */}
        <div className="space-y-3 pt-4 border-t border-brand-gray">
          <h2 className="font-display font-bold text-sm text-brand-dark-brown">
            EU-Streitschlichtung & Verbraucherstreitbeilegung
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue underline font-semibold inline-flex items-center gap-1"
            >
              https://ec.europa.eu/consumers/odr
              <ExternalLink className="w-3 h-3" />
            </a>{' '}
            finden. Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        {/* Haftung für Inhalte & Links */}
        <div className="space-y-3 pt-4 border-t border-brand-gray">
          <h2 className="font-display font-bold text-sm text-brand-dark-brown">
            Haftung für Inhalte und Links
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed">
            Unser Angebot enthält Links zu externen Websites Dritter (z. B. Kongressanmeldung Boeld Communication, Aldiana Pauschalreiserichtlinien), auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </div>

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
            href="https://artreisen.de/impressum/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-brand-blue underline inline-flex items-center gap-1"
          >
            Impressum auf artreisen.de
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
