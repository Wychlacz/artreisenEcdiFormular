import React from 'react';
import { ArrowLeft, FileText, ExternalLink, ShieldCheck, Check } from 'lucide-react';

interface AgbViewProps {
  onBack: () => void;
}

export default function AgbView({ onBack }: AgbViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-brand-dark-text" id="agb-page-view">
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
        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase font-bold tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-brand-orange" />
          Reise- und Geschäftsbedingungen
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-brand-gray/80 p-6 md:p-10 shadow-xl space-y-8">
        <div className="border-b border-brand-gray pb-6">
          <div className="flex items-center gap-2 text-brand-orange mb-2">
            <FileText className="w-6 h-6" />
            <span className="text-xs uppercase font-display font-extrabold tracking-widest">
              Reisebüro art reisen GmbH
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-brand-dark-brown">
            Allgemeine Geschäfts- und Reisebedingungen (AGB)
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Reisebedingungen der Reisebüro art reisen GmbH für das Reise- und Tagungsarrangement ECDI Spring Camp
          </p>
        </div>

        {/* Essential terms */}
        <section className="space-y-4 text-xs text-gray-700 leading-relaxed">
          <div className="bg-brand-blue/5 border border-brand-blue/20 p-4 rounded-xl">
            <strong className="text-brand-blue block text-xs mb-1">
              1. Abschluss des Pauschalreisevertrages
            </strong>
            Mit Ihrer Anmeldung bieten Sie der Reisebüro art reisen GmbH den Abschluss des Pauschalreisevertrages verbindlich an. Der Vertrag kommt mit Zugang der schriftlichen Buchungsbestätigung und des gesetzlich vorgeschriebenen Sicherungsscheins zustande.
          </div>

          <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-xl">
            <strong className="text-brand-orange block text-xs mb-1">
              2. Zubuchbare Flexoption (59,- € pro Zimmer)
            </strong>
            Mit Abschluss der zubuchbaren Flexoption für 59 Euro pro Zimmer können Sie Ihre Reise bis 15 Tage vor dem geplanten Abreisetermin ohne Angabe von Gründen kostenfrei umbuchen oder stornieren. Im Stornofall verbleiben lediglich die Optionsgebühr von 59,- € sowie eine Bearbeitungspauschale von 30,- €.
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-900">
            <strong className="text-emerald-950 block text-xs mb-1">
              3. Gesetzliche Insolvenzabsicherung (§ 651r BGB)
            </strong>
            Alle Kundengelder sind durch den gesetzlichen Insolvenzschutzbrief abgesichert. Den Nachweis (Sicherungsschein) erhalten Sie zusammen mit Ihrer Buchungsbestätigung.
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="font-display font-bold text-sm text-brand-dark-brown">
              4. Zahlungsmodalitäten & Zahlungsarten
            </h3>
            <p>
              Zahlungen können per Überweisung, SEPA-Lastschrift oder Kreditkarte erfolgen. Kreditkartendaten werden aus Sicherheits- und PCI-DSS-Gründen nicht über Webformulare erhoben, sondern telefonisch übergeben oder über einen sicheren Zahlungslink abgewickelt. Bei Kontingentbuchungen mit Kreditkarte fällt ein Disagio von 2 % an.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="font-display font-bold text-sm text-brand-dark-brown">
              5. Reiserücktritt & Reiserücktrittsversicherung
            </h3>
            <p>
              Wir empfehlen ausdrücklich den Abschluss einer Reiserücktrittskostenversicherung (Allianz), um Stornokosten bei unvorhergesehener Krankheit oder sonstigen Reisehindernissen abzusichern.
            </p>
          </div>
        </section>

        {/* Links to complete documents */}
        <div className="bg-gray-50 border border-brand-gray/60 p-4 rounded-xl space-y-2">
          <span className="font-bold text-xs text-brand-dark-brown block">Vollständige Rechtsdokumente:</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://artreisen.de/agb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-orange underline text-xs font-bold"
            >
              Vollständige AGB auf artreisen.de
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="hidden sm:inline text-gray-300">•</span>
            <a
              href="https://www.aldiana.com/dam/jcr:d462857b-be29-4edb-b2f9-cb5efa884352/Pauschalreiserichtlinien-S2023.2025-04-25-10-13-30.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-blue hover:text-brand-orange underline text-xs font-bold"
            >
              Formblatt zur Unterrichtung bei Pauschalreisen (PDF)
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
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
        </div>
      </div>
    </div>
  );
}
