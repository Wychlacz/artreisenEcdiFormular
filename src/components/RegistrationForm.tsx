import React, { useState } from 'react';
import { Registration, Reisender } from '../types';
import { DEPARTURE_AIRPORTS, ROOM_TYPES } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';
import { 
  Users, Plane, BedDouble, Info, CheckCircle, Sheet, AlertCircle,
  ArrowRight, ArrowLeft, Heart, Sparkles, CheckSquare, ShieldCheck,
  BookOpen, ExternalLink
} from 'lucide-react';

interface RegistrationFormProps {
  onSubmit: (data: Omit<Registration, 'id' | 'createdAt' | 'status'>) => void;
  onShowLegal?: (type: 'impressum' | 'datenschutz' | 'agb') => void;
  onShowAdmin?: () => void;
}

const DEFAULT_FORM_STATE = {
  anrede: '' as 'Herr' | 'Frau' | 'Divers' | '',
  vorname: '',
  nachname: '',
  geburtsdatum: '',
  strasseHausnummer: '',
  plz: '',
  ort: '',
  land: 'Deutschland',
  telefonMobil: '',
  email: '',
  personenAnzahl: 1,
  mitreisende: [] as Reisender[],
  abflughafen: '',
  abflughafenAnderer: '',
  zimmertyp: '' as Registration['zimmertyp'],
  agbKenntnis: '' as 'Ja' | 'Nein' | '',
  pauschalreiseRichtlinien: '' as 'Ja' | 'Nein' | '',
  versicherungInfoBenoetigt: '' as 'Ja' | 'Nein' | '',
  flexOption: '' as 'Ja' | 'Nein' | '',
  dsgvoEinverstaendnis: false,
  zusatzVerlaengerung: false,
  zusatzVerlaengerungText: '',
  zusatzBeachten: false,
  zusatzBeachtenText: '',
  zusatzSitzplatz: false,
  zusatzSitzplatzText: '',
  zusatzPrivatTransfer: false,
  zusatzVersicherungAngebot: false,
  zusatzRailAndFly: false,
};

export default function RegistrationForm({ onSubmit, onShowLegal, onShowAdmin }: RegistrationFormProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Schritt 0: Reisende & Flughafen
      if (!formData.anrede) newErrors.anrede = 'Anrede ist ein Pflichtfeld.';
      if (!formData.vorname.trim()) newErrors.vorname = 'Vorname ist erforderlich.';
      if (!formData.nachname.trim()) newErrors.nachname = 'Nachname ist erforderlich.';
      if (!formData.geburtsdatum) newErrors.geburtsdatum = 'Geburtsdatum ist erforderlich.';
      if (!formData.strasseHausnummer.trim()) newErrors.strasseHausnummer = 'Straße/Hausnummer ist erforderlich.';
      if (!formData.plz.trim()) newErrors.plz = 'PLZ ist erforderlich.';
      if (!formData.ort.trim()) newErrors.ort = 'Wohnort ist erforderlich.';
      if (!formData.email.trim()) {
        newErrors.email = 'E-Mail-Adresse ist erforderlich.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Ungültige E-Mail-Adresse.';
      }
      if (!formData.telefonMobil.trim()) newErrors.telefonMobil = 'Mobiltelefon ist für Erreichbarkeit erforderlich.';
      if (!formData.abflughafen) {
        newErrors.abflughafen = 'Bitte wählen Sie einen Abflughafen.';
      } else if (formData.abflughafen === 'Anderer Abflughafen (bitte angeben)' && !formData.abflughafenAnderer.trim()) {
        newErrors.abflughafenAnderer = 'Bitte tragen Sie Ihren gewünschten Abflughafen ein.';
      }

      // Validierung Mitreisende
      if (formData.personenAnzahl > 1) {
        for (let i = 0; i < formData.personenAnzahl - 1; i++) {
          const companion = formData.mitreisende[i];
          if (!companion || !companion.vorname.trim()) {
            newErrors[`companion_${i}_vorname`] = 'Vorname ist erforderlich.';
          }
          if (!companion || !companion.nachname.trim()) {
            newErrors[`companion_${i}_nachname`] = 'Nachname ist erforderlich.';
          }
          if (!companion || !companion.geburtsdatum) {
            newErrors[`companion_${i}_geburtsdatum`] = 'Geburtsdatum ist erforderlich.';
          }
        }
      }
    }

    if (step === 1) {
      // Schritt 1: Unterkunft & Optionen & Zusatzleistungen
      if (!formData.zimmertyp) {
        newErrors.zimmertyp = 'Bitte wählen Sie einen Zimmertyp aus.';
      }
      if (formData.zusatzVerlaengerung && !formData.zusatzVerlaengerungText.trim()) {
        newErrors.zusatzVerlaengerungText = 'Bitte geben Sie den gewünschten Verlängerungszeitraum an.';
      }
      if (formData.zusatzBeachten && !formData.zusatzBeachtenText.trim()) {
        newErrors.zusatzBeachtenText = 'Bitte geben Sie Ihre Erläuterungen an.';
      }
      if (formData.zusatzSitzplatz && !formData.zusatzSitzplatzText.trim()) {
        newErrors.zusatzSitzplatzText = 'Bitte geben Sie Ihren Sitzplatzwunsch an.';
      }
    }

    if (step === 2) {
      // Schritt 2: Wichtige Angaben (Ja / Nein)
      if (!formData.agbKenntnis) {
        newErrors.agbKenntnis = 'Bitte beantworten Sie diese Frage.';
      } else if (formData.agbKenntnis === 'Nein') {
        newErrors.agbKenntnis = 'Für eine Buchung müssen Sie die AGBs zur Kenntnis genommen haben.';
      }

      if (!formData.pauschalreiseRichtlinien) {
        newErrors.pauschalreiseRichtlinien = 'Bitte beantworten Sie diese Frage.';
      } else if (formData.pauschalreiseRichtlinien === 'Nein') {
        newErrors.pauschalreiseRichtlinien = 'Sie müssen über die Pauschalreiserichtlinien informiert sein.';
      }

      if (!formData.versicherungInfoBenoetigt) {
        newErrors.versicherungInfoBenoetigt = 'Bitte beantworten Sie diese Frage (Ja oder Nein).';
      }

      if (!formData.flexOption) {
        newErrors.flexOption = 'Bitte beantworten Sie diese Frage (Ja oder Nein).';
      }

      if (!formData.dsgvoEinverstaendnis) {
        newErrors.dsgvoEinverstaendnis = 'Sie müssen einwilligen, damit wir Ihre Anfrage bearbeiten dürfen.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateField = (field: keyof typeof DEFAULT_FORM_STATE, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Personenzahl und Mitreisende-Array verwalten
  const handlePersonenAnzahlChange = (num: number) => {
    const updatedMitreisende = [...formData.mitreisende];
    if (num > updatedMitreisende.length + 1) {
      // Aufstocken
      while (updatedMitreisende.length < num - 1) {
        updatedMitreisende.push({ vorname: '', nachname: '', geburtsdatum: '' });
      }
    } else if (num < updatedMitreisende.length + 1) {
      // Abschneiden
      updatedMitreisende.splice(num - 1);
    }
    setFormData(prev => ({
      ...prev,
      personenAnzahl: num,
      mitreisende: updatedMitreisende
    }));
  };

  const updateCompanionField = (index: number, field: keyof Reisender, value: string) => {
    const updatedMitreisende = [...formData.mitreisende];
    updatedMitreisende[index] = {
      ...updatedMitreisende[index],
      [field]: value
    };
    setFormData(prev => ({ ...prev, mitreisende: updatedMitreisende }));
    
    const errKey = `companion_${index}_${field}`;
    if (errors[errKey]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[errKey];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const steps = [
    { title: 'Reisende & Flug', subtitle: 'Personen & Abflughafen' },
    { title: 'Unterkunft & Zusatz', subtitle: 'Zimmertyp & Services' },
    { title: 'Rechtliches & Bestätigung', subtitle: 'AGBs & Richtlinien' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-gray/80 shadow-xl overflow-hidden" id="booking-form-card">
      {/* Brand Header & Twin-Action Selector */}
      <div className="bg-white p-6 md:p-8 border-b border-brand-gray/60" id="form-brand-header-integrated">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-gray/50 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="border-l border-brand-gray/80 pl-3 py-1">
              <span className="text-[10px] uppercase font-bold text-white bg-[#0f223d] px-2 py-0.5 rounded-full inline-block">Inhabergeführt</span>
              <span className="text-[10px] text-gray-400 font-sans block mt-1">Über 30 Jahre Reiseservice</span>
            </div>
          </div>
          <div className="text-left md:text-right font-sans">
            <h2 className="text-sm font-display font-black text-brand-dark-brown">Reisebüro Art Reisen GmbH</h2>
            <p className="text-[11px] text-gray-500 font-sans">Exklusiver Servicepartner für den ECDI Workshop, Fuerteventura</p>
          </div>
        </div>

        {/* Both Key Actions Integrated into the Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="twin-action-dashboard">
          
          {/* Action A: Wissenschaftliche Anmeldung */}
          <a
            href="https://boeld.regasus.de/online/personal;jsessionid=MIfQhCoa-qOiEpxrVJggsg-yEgiENIr61GuEwuo7.e94f5500c711"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-between bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-5 transition-all text-left group hover:shadow-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-blue">
                <BookOpen className="w-5 h-5 stroke-[2]" />
                <span className="font-display font-black text-xs uppercase tracking-wider">Option A</span>
              </div>
              <h3 className="font-display font-black text-sm text-brand-dark-brown mt-1.5 group-hover:text-brand-blue transition-colors">
                Anmeldung zum wissenschaftlichen Programm
              </h3>
              <p className="text-[11px] text-gray-500 font-sans leading-relaxed mt-1">
                Registrierung für die Vorträge und Teilnahme am wissenschaftlichen Programm direkt beim Veranstalter Boeld Communication.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-blue font-display font-black mt-4 underline">
              Zur externen Online-Anmeldung
              <ExternalLink className="w-3.5 h-3.5 text-brand-blue" />
            </div>
          </a>

          {/* Action B: Unterkunft & Transfer buchen */}
          <div
            className="flex flex-col justify-between bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-5 text-left"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-orange">
                <Plane className="w-5 h-5 stroke-[2]" />
                <span className="font-display font-black text-xs uppercase tracking-wider">Option B</span>
              </div>
              <h3 className="font-display font-black text-sm text-brand-dark-text mt-1.5">
                Unterkunft für den ECDI Workshop buchen
              </h3>
              <p className="text-[11px] text-gray-500 font-sans leading-relaxed mt-1">
                Reservierung Ihres Hotelzimmers im Sheraton Resort Fuerteventura inklusive VIP-Transfers und optionalen Reiseflügen beim Profi Art Reisen.
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-display font-black text-brand-orange">
              <span className="inline-flex w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping" />
              <span>Hier Formular unten ausfüllen (Schritt {currentStep + 1} von 3)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Progressbar */}
      <div className="bg-brand-light-bg/50 px-6 py-4 border-b border-brand-gray/70">
        <div className="flex justify-between items-center text-xs font-display font-bold text-brand-dark-brown">
          <span>Schritt {currentStep + 1}: {steps[currentStep].title}</span>
          <span className="text-brand-orange">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-brand-gray h-1.5 rounded-full overflow-hidden mt-1.5">
          <div 
            className="bg-brand-orange h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8" id="art-booking-main-form">
        
        {/* SCHRITT 0: REISENDE & FLUG */}
        {currentStep === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="border-b border-brand-gray pb-2">
              <h3 className="text-lg font-display font-bold text-brand-dark-brown">Informationen zu den Reisenden</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Tragen Sie hier alle anzumeldenden Personen ein.</p>
            </div>

            {/* Feld: Personenanzahl */}
            <div className="space-y-2">
              <label className="block text-sm font-display font-semibold text-brand-dark-text">
                Wieviele Personen reisen insgesamt an? <span className="text-brand-orange">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePersonenAnzahlChange(num)}
                    className={`w-11 h-11 rounded-lg border-2 font-display font-black text-xs transition-all cursor-pointer
                      ${formData.personenAnzahl === num
                        ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                        : 'bg-white border-brand-gray text-brand-dark-text hover:border-gray-400'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Hauptreisender */}
            <div className="space-y-4 bg-brand-light-bg/30 p-4 rounded-xl border border-brand-gray/80">
              <h4 className="font-display font-bold text-xs text-brand-dark-brown uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-gray pb-1.5">
                <Users className="w-4 h-4 text-brand-blue" />
                1. Person / Hauptreisender (Anlaufstelle für Buchung)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Anrede */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Anrede <span className="text-brand-orange">*</span></label>
                  <select
                    value={formData.anrede}
                    onChange={(e) => updateField('anrede', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                  >
                    <option value="">Bitte wählen...</option>
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                    <option value="Divers">Divers</option>
                  </select>
                  {errors.anrede && <p className="text-[11px] text-rose-600 font-sans">{errors.anrede}</p>}
                </div>

                {/* Vorname */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Vorname <span className="text-brand-orange">*</span></label>
                  <input
                    type="text"
                    value={formData.vorname}
                    onChange={(e) => updateField('vorname', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                    placeholder="Vorname laut Reisepass"
                  />
                  {errors.vorname && <p className="text-[11px] text-rose-600 font-sans">{errors.vorname}</p>}
                </div>

                {/* Nachname */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Nachname <span className="text-brand-orange">*</span></label>
                  <input
                    type="text"
                    value={formData.nachname}
                    onChange={(e) => updateField('nachname', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                    placeholder="Nachname laut Reisepass"
                  />
                  {errors.nachname && <p className="text-[11px] text-rose-600 font-sans">{errors.nachname}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Geburtsdatum */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Geburtsdatum <span className="text-brand-orange">*</span></label>
                  <input
                    type="date"
                    value={formData.geburtsdatum}
                    onChange={(e) => updateField('geburtsdatum', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.geburtsdatum && <p className="text-[11px] text-rose-600 font-sans">{errors.geburtsdatum}</p>}
                </div>

                {/* E-Mail */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown font-semibold">E-Mail-Adresse <span className="text-brand-orange">*</span></label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                    placeholder="z.B. name@beispiel.de"
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 font-sans">{errors.email}</p>}
                </div>
              </div>

              {/* Adresse */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Straße, Hausnummer <span className="text-brand-orange">*</span></label>
                  <input
                    type="text"
                    value={formData.strasseHausnummer}
                    onChange={(e) => updateField('strasseHausnummer', e.target.value)}
                    className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                    placeholder="Mustergasse 22"
                  />
                  {errors.strasseHausnummer && <p className="text-[11px] text-rose-600 font-sans">{errors.strasseHausnummer}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-display font-bold text-brand-dark-brown">PLZ <span className="text-brand-orange">*</span></label>
                    <input
                      type="text"
                      value={formData.plz}
                      onChange={(e) => updateField('plz', e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                      placeholder="80331"
                    />
                    {errors.plz && <p className="text-[11px] text-rose-600 font-sans">{errors.plz}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Ort <span className="text-brand-orange">*</span></label>
                    <input
                      type="text"
                      value={formData.ort}
                      onChange={(e) => updateField('ort', e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                      placeholder="München"
                    />
                    {errors.ort && <p className="text-[11px] text-rose-600 font-sans">{errors.ort}</p>}
                  </div>
                </div>
              </div>

              {/* Handynummer */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Mobiltelefon <span className="text-brand-orange">*</span></label>
                <input
                  type="tel"
                  value={formData.telefonMobil}
                  onChange={(e) => updateField('telefonMobil', e.target.value)}
                  className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                  placeholder="z.B. +49 170 1234567"
                />
                {errors.telefonMobil && <p className="text-[11px] text-rose-600 font-sans">{errors.telefonMobil}</p>}
                <p className="text-[9px] text-gray-400 font-sans italic">Dringend am Zielort benötigt.</p>
              </div>
            </div>

            {/* Mitreisende (Konditional ab 2 Personen) */}
            {formData.personenAnzahl > 1 && (
              <div className="space-y-5">
                <div className="border-b border-brand-gray/80 pb-1">
                  <h4 className="font-display font-bold text-sm text-brand-dark-brown">Companion / Mitreisende</h4>
                </div>
                
                {Array.from({ length: formData.personenAnzahl - 1 }).map((_, index) => (
                  <div key={index} className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/20 space-y-4">
                    <h5 className="font-display font-bold text-xs text-brand-orange uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-brand-orange" />
                      {index + 2}. Mitreisende/r
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Vorname */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Vorname <span className="text-brand-orange">*</span></label>
                        <input
                          type="text"
                          value={formData.mitreisende[index]?.vorname || ''}
                          onChange={(e) => updateCompanionField(index, 'vorname', e.target.value)}
                          className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                          placeholder="Vorname"
                        />
                        {errors[`companion_${index}_vorname`] && (
                          <p className="text-[10px] text-rose-600 font-sans">{errors[`companion_${index}_vorname`]}</p>
                        )}
                      </div>

                      {/* Nachname */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Nachname <span className="text-brand-orange">*</span></label>
                        <input
                          type="text"
                          value={formData.mitreisende[index]?.nachname || ''}
                          onChange={(e) => updateCompanionField(index, 'nachname', e.target.value)}
                          className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                          placeholder="Nachname"
                        />
                        {errors[`companion_${index}_nachname`] && (
                          <p className="text-[10px] text-rose-600 font-sans">{errors[`companion_${index}_nachname`]}</p>
                        )}
                      </div>

                      {/* Geburtsdatum */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Geburtsdatum <span className="text-brand-orange">*</span></label>
                        <input
                          type="date"
                          value={formData.mitreisende[index]?.geburtsdatum || ''}
                          onChange={(e) => updateCompanionField(index, 'geburtsdatum', e.target.value)}
                          className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                        />
                        {errors[`companion_${index}_geburtsdatum`] && (
                          <p className="text-[10px] text-rose-600 font-sans">{errors[`companion_${index}_geburtsdatum`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Abflughafen */}
            <div className="space-y-4 bg-white p-4 rounded-xl border border-brand-gray">
              <h4 className="font-display font-bold text-xs text-brand-dark-brown uppercase tracking-wider flex items-center gap-1.5 border-b border-brand-gray pb-1.5">
                <Plane className="w-4 h-4 text-brand-orange" />
                Flug & Abflughafen
              </h4>

              <div className="space-y-3">
                <label className="block text-xs font-display font-bold text-brand-dark-brown">
                  Von wo soll Ihr Flug starten? <span className="text-brand-orange">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DEPARTURE_AIRPORTS.map(ap => {
                    const isSelected = formData.abflughafen === ap;
                    return (
                      <button
                        key={ap}
                        type="button"
                        onClick={() => {
                          updateField('abflughafen', ap);
                          if (ap !== 'Anderer Abflughafen (bitte angeben)') {
                            updateField('abflughafenAnderer', '');
                          }
                        }}
                        className={`text-left p-3 border rounded-xl text-xs font-semibold font-display cursor-pointer transition-all
                          ${isSelected 
                            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-inner' 
                            : 'bg-white border-brand-gray text-gray-600 hover:border-gray-400'
                          }
                        `}
                      >
                        {ap}
                      </button>
                    );
                  })}
                </div>
                {errors.abflughafen && <p className="text-xs text-rose-600">{errors.abflughafen}</p>}

                {formData.abflughafen === 'Anderer Abflughafen (bitte angeben)' && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pt-2">
                    <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Anderer Abflughafen (bitte eingeben): <span className="text-brand-orange">*</span></label>
                    <input
                      type="text"
                      value={formData.abflughafenAnderer}
                      onChange={(e) => updateField('abflughafenAnderer', e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                      placeholder="z.B. Wien-Schwechat (VIE), Zürich (ZRH)..."
                    />
                    {errors.abflughafenAnderer && <p className="text-[11px] text-rose-600 font-sans">{errors.abflughafenAnderer}</p>}
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        )}

        {/* SCHRITT 1: UNTERKUNFT & ZUSATZLEISTUNGEN */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="border-b border-brand-gray pb-2">
              <h3 className="text-lg font-display font-bold text-brand-dark-brown">Unterkunft & Zusatzleistungen</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Wählen Sie das perfekte Zimmer und optionale Zusatzservices.</p>
            </div>

            {/* Zimmertyp-Auswahl */}
            <div className="space-y-3">
              <label className="block text-sm font-display font-bold text-brand-dark-text">
                Welchen Zimmertyp wünschen Sie im Resort? <span className="text-brand-orange">*</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ROOM_TYPES.map(rt => {
                  const isSelected = formData.zimmertyp === rt;
                  return (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => updateField('zimmertyp', rt)}
                      className={`text-left p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-brand-blue bg-brand-blue/5 shadow-md scale-[1.01]' 
                          : 'bg-white border-brand-gray hover:border-gray-400'
                        }
                      `}
                    >
                      <div className="space-y-1">
                        <span className="block font-display font-extrabold text-xs text-brand-dark-brown uppercase tracking-wider">{rt}</span>
                        <span className="block text-[10px] text-gray-400 font-sans leading-relaxed">
                          {rt.includes('Meerblick') ? 'Traumhafte Panorama-Aussicht direkt aufs offene Meer' : 'Ruhige Lage zum idyllischen Garten oder Innenhof'}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3
                        ${isSelected ? 'border-brand-blue bg-brand-blue text-white' : 'border-gray-300 bg-white'}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.zimmertyp && <p className="text-xs text-rose-600">{errors.zimmertyp}</p>}
            </div>

            {/* Zusatzleistungen (Absenden und Zusatzleistungen) */}
            <div className="bg-brand-light-bg/40 p-6 rounded-2xl border border-brand-gray space-y-4">
              <div className="border-b border-brand-gray/80 pb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-brand-orange uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 fill-brand-orange text-brand-orange" />
                  Zusatzleistungen & Sonderwünsche
                </span>
                <p className="text-[10px] text-gray-400 font-sans mt-0.5">Wählen Sie optionale Extras für Ihren Urlaub aus.</p>
              </div>

              <div className="space-y-4 font-sans text-xs text-brand-dark-text">
                
                {/* 1. Urlaub verlängern */}
                <div className="space-y-2">
                  <label className="inline-flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzVerlaengerung}
                      onChange={(e) => {
                        updateField('zusatzVerlaengerung', e.target.checked);
                        if (!e.target.checked) updateField('zusatzVerlaengerungText', '');
                      }}
                      className="mt-0.5 border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Gerne möchte ich meinen Urlaub verlängern (Zeitraum im Textfeld einfügen)</span>
                  </label>
                  
                  {formData.zusatzVerlaengerung && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pl-6 pt-1">
                      <input
                        type="text"
                        value={formData.zusatzVerlaengerungText}
                        onChange={(e) => updateField('zusatzVerlaengerungText', e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                        placeholder="Zufügenden Zeitraum eintragen (z.B. '4 Tage vorher vom 04.11. bis 08.11...')"
                      />
                      {errors.zusatzVerlaengerungText && (
                        <p className="text-[10px] text-rose-600 mt-1 font-sans">{errors.zusatzVerlaengerungText}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 2. Dinge beachten */}
                <div className="space-y-2 border-t border-brand-gray/50 pt-3">
                  <label className="inline-flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzBeachten}
                      onChange={(e) => {
                        updateField('zusatzBeachten', e.target.checked);
                        if (!e.target.checked) updateField('zusatzBeachtenText', '');
                      }}
                      className="mt-0.5 border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Folgende Dinge bitte ich zu beachten (bitte ins Textfeld einfügen)</span>
                  </label>
                  
                  {formData.zusatzBeachten && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pl-6 pt-1">
                      <textarea
                        value={formData.zusatzBeachtenText}
                        onChange={(e) => updateField('zusatzBeachtenText', e.target.value)}
                        rows={2}
                        className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                        placeholder="Ernährungsunverträglichkeiten, körperliche Einschränkungen, Zimmerwünsche nahe Aufzug..."
                      />
                      {errors.zusatzBeachtenText && (
                        <p className="text-[10px] text-rose-600 mt-1 font-sans">{errors.zusatzBeachtenText}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 3. Sitzplatz */}
                <div className="space-y-2 border-t border-brand-gray/50 pt-3">
                  <label className="inline-flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzSitzplatz}
                      onChange={(e) => {
                        updateField('zusatzSitzplatz', e.target.checked);
                        if (!e.target.checked) updateField('zusatzSitzplatzText', '');
                      }}
                      className="mt-0.5 border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Ich möchte einen besseren Sitzplatz (bitte ins Textfeld eintragen)</span>
                  </label>
                  
                  {formData.zusatzSitzplatz && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pl-6 pt-1">
                      <input
                        type="text"
                        value={formData.zusatzSitzplatzText}
                        onChange={(e) => updateField('zusatzSitzplatzText', e.target.value)}
                        className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                        placeholder="Z.B. 'Fensterplatz Reihe vor den Flügeln', 'XXL Legroom Seat'..."
                      />
                      {errors.zusatzSitzplatzText && (
                        <p className="text-[10px] text-rose-600 mt-1 font-sans">{errors.zusatzSitzplatzText}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 4. Privat-Transfer */}
                <div className="border-t border-brand-gray/50 pt-3">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzPrivatTransfer}
                      onChange={(e) => updateField('zusatzPrivatTransfer', e.target.checked)}
                      className="border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Ich möchte einen Privat-Transfer (vom Flughafen Puerto del Rosario direkt zum Resort)</span>
                  </label>
                </div>

                {/* 5. Versicherung Angebot */}
                <div className="border-t border-brand-gray/50 pt-3">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzVersicherungAngebot}
                      onChange={(e) => updateField('zusatzVersicherungAngebot', e.target.checked)}
                      className="border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Bitte geben Sie mir ein Angebot für eine Reiserücktrittskostenversicherung (Allianz)</span>
                  </label>
                </div>

                {/* 6. Rail & Fly */}
                <div className="border-t border-brand-gray/50 pt-3">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzRailAndFly}
                      onChange={(e) => updateField('zusatzRailAndFly', e.target.checked)}
                      className="border-brand-gray text-brand-orange rounded-xs"
                    />
                    <span className="font-semibold text-xs text-brand-dark-brown">Ich möchte ein Angebot für Rail & Fly (Zug-zum-Flug Bundesweit)</span>
                  </label>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* SCHRITT 2: RECHTLICHES & BESTÄTIGUNGEN (AGBS) */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="border-b border-brand-gray pb-2">
              <h3 className="text-lg font-display font-bold text-brand-dark-brown">Wichtige Erklärungen & Bestätigungen</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Bitte beantworten Sie die folgenden gesetzlich vorgeschriebenen Fragen zur Pauschalreise.</p>
            </div>

            <div className="space-y-6">

              {/* 1. AGBs vom Veranstalter */}
              <div className="bg-white p-4 rounded-xl border border-brand-gray space-y-3">
                <label className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider">
                  1. Wir haben die AGB´s vom Veranstalter zur Kenntnis genommen (siehe &quot;Wichtige Informationen&quot;) <span className="text-brand-orange">*</span>
                </label>
                <div className="flex gap-4">
                  {['Ja', 'Nein'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('agbKenntnis', opt)}
                      className={`px-5 py-2.5 rounded-lg border text-xs font-bold font-display cursor-pointer transition-colors
                        ${formData.agbKenntnis === opt
                          ? (opt === 'Ja' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600')
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.agbKenntnis && <p className="text-xs text-rose-600 font-semibold font-sans">{errors.agbKenntnis}</p>}
              </div>

              {/* 2. Pauschalreiserichtlinien */}
              <div className="bg-white p-4 rounded-xl border border-brand-gray space-y-3">
                <label className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider">
                  2. Über die Pauschalreiserichtlinien sind wir informiert (siehe &quot;Wichtige Informationen&quot;) <span className="text-brand-orange">*</span>
                </label>
                <div className="flex gap-4">
                  {['Ja', 'Nein'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('pauschalreiseRichtlinien', opt)}
                      className={`px-5 py-2.5 rounded-lg border text-xs font-bold font-display cursor-pointer transition-colors
                        ${formData.pauschalreiseRichtlinien === opt
                          ? (opt === 'Ja' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600')
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.pauschalreiseRichtlinien && <p className="text-xs text-rose-600 font-semibold font-sans">{errors.pauschalreiseRichtlinien}</p>}
              </div>

              {/* 3. Reiserücktrittskostenversicherung */}
              <div className="bg-white p-4 rounded-xl border border-brand-gray space-y-3">
                <label className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider">
                  3. Wir benötigen Informationen zur Reiserücktrittskostenversicherung <span className="text-brand-orange">*</span>
                </label>
                <div className="flex gap-4">
                  {['Ja', 'Nein'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('versicherungInfoBenoetigt', opt)}
                      className={`px-5 py-2.5 rounded-lg border text-xs font-bold font-display cursor-pointer transition-colors
                        ${formData.versicherungInfoBenoetigt === opt
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.versicherungInfoBenoetigt && <p className="text-xs text-rose-600 font-semibold font-sans">{errors.versicherungInfoBenoetigt}</p>}
              </div>

              {/* 4. Flexoption für 59 Euro */}
              <div className="bg-brand-orange/5 p-5 rounded-2xl border border-brand-orange/20 space-y-3">
                <label className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider">
                  4. Wir möchten gerne für unsere Reise eine Flexoption für 59 Euro abschliessen <span className="text-brand-orange">*</span>
                </label>
                <div className="flex gap-4">
                  {['Ja', 'Nein'].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateField('flexOption', opt)}
                      className={`px-5 py-2.5 rounded-lg border text-xs font-bold font-display cursor-pointer transition-colors
                        ${formData.flexOption === opt
                          ? 'bg-brand-orange text-white border-brand-orange'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {errors.flexOption && <p className="text-xs text-rose-600 font-semibold font-sans">{errors.flexOption}</p>}
                
                {/* Information Text provided literally */}
                <div className="bg-white/80 p-3.5 border border-brand-orange/20 rounded-xl text-[11px] leading-relaxed text-gray-600 font-sans mt-3">
                  <span className="font-bold text-brand-orange block mb-1">Hinweis zur Flexoption:</span>
                  - Bei Zubuchung der Flexoption in Höhe von 59 Euro können Sie bis 15 Tage vorher kostenlos umbuchen und stornieren ohne Angaben von Gründen. Im Stornofall haben Sie dann nur die Kosten von 59 Euro zzgl. 30 Euro Servicegebühr für Ihre Pauschalreise. Die Flexoption ist pro Zimmer !
                </div>
              </div>

              {/* DSGVO Einwilligung */}
              <div className="p-4 bg-brand-light-bg/60 border border-brand-gray rounded-xl space-y-2">
                <label className="inline-flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dsgvoEinverstaendnis}
                    onChange={(e) => updateField('dsgvoEinverstaendnis', e.target.checked)}
                    id="checkbox-dsgvo"
                    className="mt-1 border-brand-gray text-brand-blue rounded-xs"
                  />
                  <span className="font-sans text-xs text-brand-dark-text leading-relaxed">
                    <strong>DSGVO-Einverständnis *</strong><br />
                    Ich willige ein, dass diese Website meine übermittelten Informationen speichert, sodass meine Anfrage beantwortet werden kann. Inhaberschutz und sichere Speicherung gewährleistet.
                  </span>
                </label>
                {errors.dsgvoEinverstaendnis && <p className="text-xs text-rose-600 font-semibold pl-6 font-sans">{errors.dsgvoEinverstaendnis}</p>}
              </div>

            </div>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center border-t border-brand-gray pt-6" id="form-action-buttons">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              id="btn-back-step"
              className="inline-flex items-center gap-2 border border-brand-gray hover:bg-brand-light-bg text-brand-dark-brown font-display font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              id="btn-next-step"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md ml-auto"
            >
              Weiter
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              id="btn-submit-registration"
              className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-yellow text-white font-display font-black text-xs px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg ml-auto"
            >
              Absenden und Zusatzleistungen buchen
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </form>

      {/* Small Inline legal footer since main page footer is gone */}
      {onShowLegal && (
        <div className="bg-gray-50 border-t border-brand-gray/60 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-400 font-sans">
          <span>© {new Date().getFullYear()} Reisebüro Art Reisen GmbH, München. Alle Rechte vorbehalten.</span>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => onShowLegal('impressum')} className="hover:underline font-bold text-gray-500 cursor-pointer">Impressum</button>
            <span>•</span>
            <button type="button" onClick={() => onShowLegal('datenschutz')} className="hover:underline font-bold text-gray-500 cursor-pointer">Datenschutz</button>
            <span>•</span>
            <button type="button" onClick={() => onShowLegal('agb')} className="hover:underline font-bold text-gray-500 cursor-pointer font-sans">Teilnahmebedingungen</button>
            {onShowAdmin && (
              <>
                <span>•</span>
                <button type="button" onClick={onShowAdmin} className="hover:underline text-gray-400 cursor-pointer text-[9px] font-mono">Admin</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
