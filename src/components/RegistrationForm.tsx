import React, { useState } from 'react';
import { Registration, Reisender, ZimmerBuchung } from '../types';
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
  zimmerIndex: 0,
  isFirmenrechnung: false,
  firmenName: '',
  firmenAnschrift: '',
  firmenAnsprechpartner: '',
  isHauptanmelderReisender: true,
  abweichenderReisenderAnrede: '' as 'Herr' | 'Frau' | 'Divers' | '',
  abweichenderReisenderVorname: '',
  abweichenderReisenderNachname: '',
  abweichenderReisenderGeburtsdatum: '',
  personenAnzahl: 1,
  mitreisende: [] as Reisender[],
  zimmer: [
    { gaesteAnzahl: 1, zimmertyp: '' }
  ] as ZimmerBuchung[],
  abflughafen: '',
  abflughafenAnderer: '',
  zimmertyp: '' as Registration['zimmertyp'],
  agbKenntnis: '' as 'Ja' | 'Nein' | '',
  pauschalreiseRichtlinien: '' as 'Ja' | 'Nein' | '',
  versicherungInfoBenoetigt: '' as 'Ja' | 'Nein' | '',
  flexOption: '' as 'Ja' | 'Nein' | '',
  zahlungsart: '' as 'Lastschrift' | 'Überweisung' | 'Kreditkarte' | '',
  zahlungLastschriftDatenEingeben: 'online' as 'online' | 'telefonisch',
  zahlungKreditkarteDatenEingeben: 'online' as 'online' | 'telefonisch',
  zahlungIban: '',
  zahlungKontoinhaber: '',
  zahlungKreditkarteNummer: '',
  zahlungKreditkarteGueltig: '',
  zahlungKreditkarteInhaber: '',
  dsgvoEinverstaendnis: false,
  zusatzVerlaengerung: false,
  zusatzVerlaengerungText: '',
  zusatzBeachten: false,
  zusatzBeachtenText: '',
  zusatzSitzplatz: false,
  zusatzSitzplatzText: '',
  zusatzPrivatTransfer: false,
  zusatzTransferAuswahlPrivat: false,
  zusatzTransferAuswahlMietwagen: false,
  zusatzVersicherungAngebot: false,
  zusatzRailAndFly: false,
};

const applyDefaultRoomAssignments = (rooms: ZimmerBuchung[], companions: Reisender[]) => {
  const assignments: number[] = [];
  for (let zIdx = 0; zIdx < rooms.length; zIdx++) {
    const count = rooms[zIdx].gaesteAnzahl || 1;
    for (let c = 0; c < count; c++) {
      assignments.push(zIdx);
    }
  }
  
  const mainRoomIndex = assignments[0] !== undefined ? assignments[0] : 0;
  const updatedCompanions = companions.map((comp, idx) => {
    const compRoomIndex = assignments[idx + 1] !== undefined ? assignments[idx + 1] : 0;
    return {
      ...comp,
      zimmerIndex: compRoomIndex
    };
  });
  
  return { mainRoomIndex, updatedCompanions };
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
      } else if (formData.abflughafen === 'andere Flughäfen' && !formData.abflughafenAnderer.trim()) {
        newErrors.abflughafenAnderer = 'Bitte tragen Sie Ihren gewünschten Abflughafen ein.';
      }

      // Validierung Firmenrechnung
      if (formData.isFirmenrechnung) {
        if (!formData.firmenName?.trim()) {
          newErrors.firmenName = 'Firmenname ist ein Pflichtfeld für Firmenrechnungen.';
        }
        if (!formData.firmenAnschrift?.trim()) {
          newErrors.firmenAnschrift = 'Firmenanschrift ist ein Pflichtfeld für Firmenrechnungen.';
        }
      }

      // Validierung abweichender Reisender für Zimmer 1 (falls Hauptanmelder nicht der Reisende ist)
      if (formData.isHauptanmelderReisender === false) {
        if (!formData.abweichenderReisenderAnrede) {
          newErrors.abweichenderReisenderAnrede = 'Anrede des Reisenden ist ein Pflichtfeld.';
        }
        if (!formData.abweichenderReisenderVorname?.trim()) {
          newErrors.abweichenderReisenderVorname = 'Vorname des Reisenden ist erforderlich.';
        }
        if (!formData.abweichenderReisenderNachname?.trim()) {
          newErrors.abweichenderReisenderNachname = 'Nachname des Reisenden ist erforderlich.';
        }
        if (!formData.abweichenderReisenderGeburtsdatum) {
          newErrors.abweichenderReisenderGeburtsdatum = 'Geburtsdatum des Reisenden ist erforderlich.';
        }
      }

      // Validierung Zimmer / Room Configuration
      if (formData.zimmer && formData.zimmer.length > 0) {
        formData.zimmer.forEach((z, idx) => {
          if (!z.zimmertyp) {
            newErrors[`zimmer_${idx}_zimmertyp`] = `Bitte wählen Sie eine Zimmerkategorie für Zimmer ${idx + 1}.`;
          }
        });
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

      // Validierung Zimmer-Zuordnung bei mehreren Zimmern
      if (formData.zimmer && formData.zimmer.length > 1) {
        if (formData.zimmerIndex === undefined || formData.zimmerIndex === null || formData.zimmerIndex === '') {
          newErrors.zimmerIndex = 'Bitte ordnen Sie dem Hauptreisenden ein Zimmer zu.';
        }
        if (formData.personenAnzahl > 1) {
          for (let i = 0; i < formData.personenAnzahl - 1; i++) {
            const companion = formData.mitreisende[i];
            if (!companion || companion.zimmerIndex === undefined || companion.zimmerIndex === null || companion.zimmerIndex === '') {
              newErrors[`companion_${i}_zimmerIndex`] = 'Bitte ordnen Sie diesem Mitreisenden ein Zimmer zu.';
            }
          }
        }
      }
    }

    if (step === 1) {
      // Schritt 1: Zusatzleistungen, Wichtige Angaben & Bestätigungen
      if (formData.zusatzVerlaengerung && !formData.zusatzVerlaengerungText.trim()) {
        newErrors.zusatzVerlaengerungText = 'Bitte geben Sie den gewünschten Verlängerungszeitraum an.';
      }
      if (formData.zusatzBeachten && !formData.zusatzBeachtenText.trim()) {
        newErrors.zusatzBeachtenText = 'Bitte geben Sie Ihre Erläuterungen an.';
      }
      if (formData.zusatzSitzplatz && !formData.zusatzSitzplatzText.trim()) {
        newErrors.zusatzSitzplatzText = 'Bitte geben Sie Ihren Sitzplatzwunsch an.';
      }

      // Wichtige Angaben (Ja / Nein)
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

      if (!formData.zahlungsart) {
        newErrors.zahlungsart = 'Bitte wählen Sie Ihre bevorzugte Zahlungsart.';
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

  // Zimmeranzahl und Belegung verwalten (Max 4 Zimmer)
  const handleZimmerAnzahlChange = (num: number) => {
    const updatedZimmer = [...(formData.zimmer || [{ gaesteAnzahl: 1, zimmertyp: '' }])];
    if (num > updatedZimmer.length) {
      while (updatedZimmer.length < num) {
        updatedZimmer.push({ gaesteAnzahl: 1, zimmertyp: '' });
      }
    } else if (num < updatedZimmer.length) {
      updatedZimmer.splice(num);
    }
    
    // Gesamtpersonen kalkulieren
    const totalGuests = updatedZimmer.reduce((sum, z) => sum + z.gaesteAnzahl, 0);
    
    // Mitreisende synchronisieren
    const updatedMitreisende = [...formData.mitreisende];
    if (totalGuests > updatedMitreisende.length + 1) {
      while (updatedMitreisende.length < totalGuests - 1) {
        updatedMitreisende.push({ vorname: '', nachname: '', geburtsdatum: '' });
      }
    } else if (totalGuests < updatedMitreisende.length + 1) {
      updatedMitreisende.splice(totalGuests - 1);
    }

    // Automatische Zimmerzuteilung berechnen
    const { mainRoomIndex, updatedCompanions } = applyDefaultRoomAssignments(updatedZimmer, updatedMitreisende);

    setFormData(prev => ({
      ...prev,
      zimmer: updatedZimmer,
      personenAnzahl: totalGuests,
      mitreisende: updatedCompanions,
      zimmerIndex: mainRoomIndex,
      zimmertyp: updatedZimmer[0]?.zimmertyp || ''
    }));
  };

  const updateZimmerField = (index: number, field: keyof ZimmerBuchung, value: any) => {
    const updatedZimmer = [...(formData.zimmer || [{ gaesteAnzahl: 1, zimmertyp: '' }])];
    updatedZimmer[index] = {
      ...updatedZimmer[index],
      [field]: value
    };

    // Bei Personen-Änderung Belegung aktualisieren
    let totalGuests = formData.personenAnzahl;
    let updatedMitreisende = formData.mitreisende;
    if (field === 'gaesteAnzahl') {
      totalGuests = updatedZimmer.reduce((sum, z) => sum + z.gaesteAnzahl, 0);
      updatedMitreisende = [...formData.mitreisende];
      if (totalGuests > updatedMitreisende.length + 1) {
        while (updatedMitreisende.length < totalGuests - 1) {
          updatedMitreisende.push({ vorname: '', nachname: '', geburtsdatum: '' });
        }
      } else if (totalGuests < updatedMitreisende.length + 1) {
        updatedMitreisende.splice(totalGuests - 1);
      }
    }

    // Automatische Zimmerzuteilung berechnen wenn sich Personen oder Anzahl im Zimmer geändert hat
    let mainRoomIndex = formData.zimmerIndex;
    let updatedCompanions = updatedMitreisende;
    if (field === 'gaesteAnzahl') {
      const assigned = applyDefaultRoomAssignments(updatedZimmer, updatedMitreisende);
      mainRoomIndex = assigned.mainRoomIndex;
      updatedCompanions = assigned.updatedCompanions;
    }

    setFormData(prev => ({
      ...prev,
      zimmer: updatedZimmer,
      personenAnzahl: totalGuests,
      mitreisende: updatedCompanions,
      zimmerIndex: mainRoomIndex,
      // Legacysupport für zimmertyp (verwende das erste Zimmer für Tabellen)
      zimmertyp: updatedZimmer[0]?.zimmertyp || ''
    }));

    // Fehler-Meldung zurücksetzen
    const errKey = `zimmer_${index}_${field}`;
    if (errors[errKey]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[errKey];
        return copy;
      });
    }
  };

  const updateCompanionField = (index: number, field: keyof Reisender, value: any) => {
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
    { title: 'Reisende & Unterkunft', subtitle: 'Gäste, Zimmer & Flug' },
    { title: 'Zusatzleistungen & Rechtliches', subtitle: 'Services, AGB & Erklärungen' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-brand-gray/80 shadow-xl overflow-hidden" id="booking-form-card">
      {/* Brand Header & Twin-Action Selector */}
      <div className="bg-white p-6 md:p-8 border-b border-brand-gray/60" id="form-brand-header-integrated">
        <div className="border-b border-brand-gray/50 pb-6 mb-6">
          <h2 className="text-lg md:text-xl font-display font-black text-brand-dark-brown">
            ECDI SPRING CAMP  29.04. - 03.05.2027
          </h2>
          <p className="text-sm md:text-base text-brand-blue mt-1.5 font-sans font-semibold">
            art reisen GmbH ist Exclusiver Servicepartner für das ECDI Spring Camp
          </p>
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
              </div>
              <h3 className="font-display font-black text-sm text-brand-dark-text mt-1.5">
                Unterkunft für das ECDI Spring Camp buchen
              </h3>
              <p className="text-[11px] text-gray-500 font-sans leading-relaxed mt-1">
                Reservierung Ihres Hotelzimmers im Aldiana Fuerteventura incl. Flug , Transfer und Rail&Fly.
              </p>
            </div>
            
            <div className="inline-flex items-center gap-2 mt-4 text-xs font-display font-black text-brand-orange">
              <span className="inline-flex w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping" />
              <span>Hier Formular unten ausfüllen (Schritt {currentStep + 1} von 2)</span>
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
              <p className="text-xs text-gray-500 font-sans mt-0.5">Tragen Sie hier alle anzumeldenden Personen ein und planen Sie Ihre Zimmer.</p>
            </div>

            {/* Zimmer- und Belegungsplanung (Max 4 Zimmer) */}
            <div className="bg-brand-blue/5 p-5 rounded-2xl border border-brand-blue/20 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-brand-blue/15 pb-4">
                <div>
                  <h4 className="font-display font-black text-xs text-brand-dark-brown uppercase tracking-wider flex items-center gap-1.5">
                    <BedDouble className="w-4 h-4 text-brand-blue" />
                    Zimmer- und Belegungsplanung
                  </h4>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">Kunden können maximal 4 Zimmer gleichzeitig buchen.</p>
                </div>
                
                {/* Wieviele Zimmer Anfrage */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-display font-bold text-brand-dark-brown">Anzahl Zimmer:</span>
                  <div className="flex gap-1 bg-white p-1 rounded-lg border border-brand-gray/60">
                    {[1, 2, 3, 4].map(num => {
                      const zimmerCount = formData.zimmer?.length || 1;
                      const isSelected = zimmerCount === num;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleZimmerAnzahlChange(num)}
                          className={`w-7 h-7 rounded-md font-display font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center
                            ${isSelected 
                              ? 'bg-brand-blue text-white shadow-xs' 
                              : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Jedes Zimmer einzeln konfigurieren */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(formData.zimmer || [{ gaesteAnzahl: 1, zimmertyp: '' }]).map((z, index) => {
                  return (
                    <div key={index} className="bg-white p-4 rounded-xl border border-brand-gray/80 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <span className="font-display font-black text-[11px] text-brand-blue uppercase tracking-wider flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-brand-blue/80" />
                          Zimmer {index + 1}
                        </span>
                        
                        {/* Wieviele Personen pro Zimmer */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400">Gäste:</span>
                          <div className="flex gap-0.5 bg-gray-50 p-0.5 rounded-md border border-gray-200">
                            {[1, 2, 3, 4].map(pNum => {
                              const isSelected = z.gaesteAnzahl === pNum;
                              return (
                                <button
                                  key={pNum}
                                  type="button"
                                  onClick={() => updateZimmerField(index, 'gaesteAnzahl', pNum)}
                                  className={`px-2 py-0.5 rounded-sm font-display font-semibold text-[10px] transition-all cursor-pointer
                                    ${isSelected 
                                      ? 'bg-brand-orange text-white shadow-xs' 
                                      : 'text-gray-600 hover:bg-white'
                                    }
                                  `}
                                >
                                  {pNum}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Ausgewähltes Zimmer */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-display font-bold text-brand-dark-brown">
                          Zimmerkategorie wählen <span className="text-brand-orange">*</span>
                        </label>
                        <select
                          value={z.zimmertyp}
                          onChange={(e) => updateZimmerField(index, 'zimmertyp', e.target.value as any)}
                          className="w-full bg-white px-2.5 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                        >
                          <option value="">-- Zimmertyp aussuchen --</option>
                          {ROOM_TYPES.map(rt => (
                            <option key={rt} value={rt}>{rt}</option>
                          ))}
                        </select>
                        {errors[`zimmer_${index}_zimmertyp`] && (
                          <p className="text-[10px] text-rose-600 font-sans mt-0.5 font-semibold">{errors[`zimmer_${index}_zimmertyp`]}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Zusammenfassung der Zimmer */}
              <div className="bg-brand-orange/5 border border-brand-orange/20 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                <span className="text-brand-dark-brown font-semibold font-sans">Gewählte Belegung:</span>
                <span className="font-display font-black text-brand-orange text-[11px] uppercase tracking-wider">
                  {(formData.zimmer || []).length} Zimmer | {formData.personenAnzahl} Personen insgesamt (haupt- & mitreisende)
                </span>
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

              {/* Zimmer-Zuordnung & Belegungsdetails für den Hauptreisenden */}
              {formData.zimmer && formData.zimmer.length > 0 && (
                <div className="space-y-4 pt-3 border-t border-brand-gray/40">
                  <div className="bg-brand-blue/5 p-4 rounded-xl border border-brand-blue/15 space-y-3">
                    <div className="flex items-center gap-1.5 font-display font-bold text-[11px] text-brand-dark-brown uppercase tracking-wider">
                      <BedDouble className="w-4 h-4 text-brand-blue" />
                      <span>Zimmerbelegung für Zimmer 1</span>
                    </div>

                    <div className="text-xs text-brand-dark-brown">
                      Zimmertyp: <strong className="text-brand-blue">{formData.zimmer[0]?.zimmertyp || 'Kategorie noch unbestimmt'}</strong>
                    </div>

                    {/* Abfrage, ob der Hauptanmelder selbst reist */}
                    <div className="flex items-start gap-2 pt-1 border-t border-brand-gray/20">
                      <input
                        type="checkbox"
                        id="isHauptanmelderReisender"
                        checked={formData.isHauptanmelderReisender}
                        onChange={(e) => updateField('isHauptanmelderReisender', e.target.checked)}
                        className="w-4 h-4 text-brand-blue border-brand-gray rounded focus:ring-brand-blue cursor-pointer mt-0.5 flex-shrink-0"
                      />
                      <label htmlFor="isHauptanmelderReisender" className="text-xs font-display font-semibold text-brand-dark-brown select-none cursor-pointer leading-tight">
                        <span>Der Hauptanmelder (oben eingetragen) ist selbst Reiseteilnehmer in Zimmer 1</span>
                      </label>
                    </div>

                    {/* Felder für abweichenden Reisenden */}
                    {!formData.isHauptanmelderReisender && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-2 pl-4 border-l-2 border-brand-orange/40 overflow-hidden"
                      >
                        <p className="text-[10px] text-brand-orange font-bold font-sans">
                          Bitte tragen Sie den Namen und das Geburtsdatum des tatsächlichen Reisegastes ein:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-display font-bold text-brand-dark-brown">Anrede <span className="text-brand-orange">*</span></label>
                            <select
                              value={formData.abweichenderReisenderAnrede || ''}
                              onChange={(e) => updateField('abweichenderReisenderAnrede', e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                            >
                              <option value="">Bitte wählen...</option>
                              <option value="Herr">Herr</option>
                              <option value="Frau">Frau</option>
                              <option value="Divers">Divers</option>
                            </select>
                            {errors.abweichenderReisenderAnrede && <p className="text-[9px] text-rose-600 font-sans">{errors.abweichenderReisenderAnrede}</p>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-display font-bold text-brand-dark-brown">Vorname <span className="text-brand-orange">*</span></label>
                            <input
                              type="text"
                              value={formData.abweichenderReisenderVorname || ''}
                              onChange={(e) => updateField('abweichenderReisenderVorname', e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                              placeholder="Vorname laut Reisepass"
                            />
                            {errors.abweichenderReisenderVorname && <p className="text-[9px] text-rose-600 font-sans">{errors.abweichenderReisenderVorname}</p>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-display font-bold text-brand-dark-brown">Nachname <span className="text-brand-orange">*</span></label>
                            <input
                              type="text"
                              value={formData.abweichenderReisenderNachname || ''}
                              onChange={(e) => updateField('abweichenderReisenderNachname', e.target.value)}
                              className="w-full bg-white px-2.5 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                              placeholder="Nachname laut Reisepass"
                            />
                            {errors.abweichenderReisenderNachname && <p className="text-[9px] text-rose-600 font-sans">{errors.abweichenderReisenderNachname}</p>}
                          </div>
                        </div>

                        <div className="space-y-1.5 max-w-full md:max-w-xs">
                          <label className="block text-[10px] font-display font-bold text-brand-dark-brown">Geburtsdatum <span className="text-brand-orange">*</span></label>
                          <input
                            type="date"
                            value={formData.abweichenderReisenderGeburtsdatum || ''}
                            onChange={(e) => updateField('abweichenderReisenderGeburtsdatum', e.target.value)}
                            className="w-full bg-white px-2.5 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                            max={new Date().toISOString().split('T')[0]}
                          />
                          {errors.abweichenderReisenderGeburtsdatum && <p className="text-[9px] text-rose-600 font-sans">{errors.abweichenderReisenderGeburtsdatum}</p>}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {formData.zimmer.length > 1 && (
                    <div className="space-y-1.5 bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/15">
                      <label className="block text-[11px] font-display font-bold text-brand-dark-brown select-none flex items-center gap-1">
                        <span>Zimmerschlüssel-Zuordnung: Welchem Zimmer gehört dieser Reisende an?</span>
                        <span className="text-brand-orange">*</span>
                      </label>
                      <select
                        value={formData.zimmerIndex !== undefined ? formData.zimmerIndex : ''}
                        onChange={(e) => updateField('zimmerIndex', e.target.value === '' ? '' : parseInt(e.target.value))}
                        className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                      >
                        <option value="">-- Zimmer auswählen --</option>
                        {formData.zimmer.map((z, idx) => (
                          <option key={idx} value={idx}>
                            Zimmer {idx + 1} ({z.zimmertyp || 'Kategorie noch unbestimmt'})
                          </option>
                        ))}
                      </select>
                      {errors.zimmerIndex && <p className="text-[11px] text-rose-600 font-sans mt-0.5">{errors.zimmerIndex}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Optional: Firmenrechnung */}
              <div className="space-y-3 pt-4 border-t border-brand-gray/40">
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFirmenrechnung"
                    checked={formData.isFirmenrechnung || false}
                    onChange={(e) => updateField('isFirmenrechnung', e.target.checked)}
                    className="w-4 h-4 text-brand-orange border-brand-gray rounded focus:ring-brand-orange cursor-pointer mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="isFirmenrechnung" className="text-xs md:text-sm font-display font-bold text-brand-orange select-none cursor-pointer flex items-start gap-1.5 leading-relaxed">
                    <Sheet className="w-4 h-4 text-brand-orange mt-0.5 flex-shrink-0" />
                    <span>Sollte die Rechnung auf ein Unternehmen ausgestellt werden, benötigen wir bitte noch die abweichende Firmenanschrift. Bitte teilen Sie uns in diesem Fall den exakten Firmennamen und – falls gewünscht – einen zusätzlichen Ansprechpartner (z. B. Sekretariat oder Abteilung) mit.</span>
                  </label>
                </div>
                
                {formData.isFirmenrechnung && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="space-y-3 pl-6 pt-2 border-l-2 border-brand-orange/40 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-display font-bold text-brand-dark-brown">
                          Firmenname <span className="text-brand-orange">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.firmenName || ''}
                          onChange={(e) => updateField('firmenName', e.target.value)}
                          className="w-full bg-white px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                          placeholder="z.B. Cloud Services GmbH"
                        />
                        {errors.firmenName && <p className="text-[10px] text-rose-600 font-sans">{errors.firmenName}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-display font-bold text-brand-dark-brown">
                          Ansprechpartner (falls vom Hauptreisenden unterschiedlich)
                        </label>
                        <input
                          type="text"
                          value={formData.firmenAnsprechpartner || ''}
                          onChange={(e) => updateField('firmenAnsprechpartner', e.target.value)}
                          className="w-full bg-white px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                          placeholder="z.B. Frau Sarah Müller oder leer lassen"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-display font-bold text-brand-dark-brown">
                        Firmenanschrift <span className="text-brand-orange">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firmenAnschrift || ''}
                        onChange={(e) => updateField('firmenAnschrift', e.target.value)}
                        className="w-full bg-white px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                        placeholder="z.B. Musterstr. 12, 12345 Berlin, Deutschland"
                      />
                      {errors.firmenAnschrift && <p className="text-[10px] text-rose-600 font-sans">{errors.firmenAnschrift}</p>}
                    </div>
                  </motion.div>
                )}
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

                    {/* Zimmer-Zuordnung für Mitreisende */}
                    {formData.zimmer && formData.zimmer.length > 1 && (
                      <div className="space-y-1.5 pt-2 border-t border-brand-gray/40">
                        <label className="block text-[11px] font-display font-bold text-brand-dark-brown select-none flex items-center gap-1">
                          <span>Zimmerschlüssel-Zuordnung: Welchem Zimmer gehört dieser Reisende an?</span>
                          <span className="text-brand-orange">*</span>
                        </label>
                        <select
                          value={formData.mitreisende[index]?.zimmerIndex !== undefined ? formData.mitreisende[index].zimmerIndex : ''}
                          onChange={(e) => updateCompanionField(index, 'zimmerIndex' as any, e.target.value === '' ? '' : parseInt(e.target.value))}
                          className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans text-brand-dark-text"
                        >
                          <option value="">-- Zimmer auswählen --</option>
                          {formData.zimmer.map((z, idx) => (
                            <option key={idx} value={idx}>
                              Zimmer {idx + 1} ({z.zimmertyp || 'Kategorie noch unbestimmt'})
                            </option>
                          ))}
                        </select>
                        {errors[`companion_${index}_zimmerIndex`] && (
                          <p className="text-[10px] text-rose-600 font-sans mt-0.5">{errors[`companion_${index}_zimmerIndex`]}</p>
                        )}
                      </div>
                    )}
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
                          if (ap !== 'andere Flughäfen') {
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

                {formData.abflughafen === 'andere Flughäfen' && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pt-2">
                    <label className="block text-[11px] font-display font-bold text-brand-dark-brown">Welcher andere Abflughafen? <span className="text-brand-orange">*</span></label>
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

        {/* SCHRITT 1: ZUSATZLEISTUNGEN & RECHTLICHES */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="border-b border-brand-gray pb-2">
              <h3 className="text-lg font-display font-bold text-brand-dark-brown">Zusatzleistungen & Rechtliches</h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Gestalten Sie Ihre Reise individuell und bestätigen Sie die rechtlichen Richtlinien.</p>
            </div>

            {/* Zusatzleistungen (Sonderwünsche) */}
            <div className="bg-brand-light-bg/40 p-6 rounded-2xl border border-brand-gray space-y-4">
              <div className="border-b border-brand-gray/80 pb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-brand-orange uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 fill-brand-orange text-brand-orange" />
                  Zusatzleistungen & Sonderwünsche
                </span>
                <p className="text-[10px] text-gray-400 font-sans mt-0.5">Wählen Sie optionale Extras für Ihren Urlaub aus (optional).</p>
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
                    <span className="font-semibold text-xs text-brand-dark-brown">Folgende "Dinge bitte ich zu beachten" (z.B. Zimmerlage oder Nummer, Topper usw.)</span>
                  </label>
                  
                  {formData.zusatzBeachten && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pl-6 pt-1">
                      <textarea
                        value={formData.zusatzBeachtenText}
                        onChange={(e) => updateField('zusatzBeachtenText', e.target.value)}
                        rows={2}
                        className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                        placeholder="Zimmerlage, Zimmernummer, Topper, Ernährungsunverträglichkeiten, körperliche Einschränkungen..."
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
                  <label className="inline-flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.zusatzPrivatTransfer}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        updateField('zusatzPrivatTransfer', checked);
                        if (checked) {
                          updateField('zusatzTransferAuswahlPrivat', true);
                          updateField('zusatzTransferAuswahlMietwagen', false);
                        } else {
                          updateField('zusatzTransferAuswahlPrivat', false);
                          updateField('zusatzTransferAuswahlMietwagen', false);
                        }
                      }}
                      className="mt-1 border-brand-gray text-brand-orange rounded-xs"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-brand-dark-brown">Ich möchte einen Privat-Transfer oder Mietwagen ab/bis Flughafen Fuerteventura</span>
                    </div>
                  </label>

                  {/* Sub-Auswahl für Privattransfer / Mietwagen */}
                  <AnimatePresence>
                    {formData.zusatzPrivatTransfer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pl-7 mt-2 space-y-2 overflow-hidden"
                      >
                        <p className="text-[10px] text-gray-500 font-sans mb-1">Bitte wählen Sie eine oder beide Optionen:</p>
                        <div className="flex flex-wrap gap-4">
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.zusatzTransferAuswahlPrivat}
                              onChange={(e) => updateField('zusatzTransferAuswahlPrivat', e.target.checked)}
                              className="border-brand-gray text-brand-orange rounded-xs w-3.5 h-3.5"
                            />
                            <span className="text-xs text-brand-dark-brown font-medium">Privattransfer</span>
                          </label>
                          <label className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.zusatzTransferAuswahlMietwagen}
                              onChange={(e) => updateField('zusatzTransferAuswahlMietwagen', e.target.checked)}
                              className="border-brand-gray text-brand-orange rounded-xs w-3.5 h-3.5"
                            />
                            <span className="text-xs text-brand-dark-brown font-medium">Mietwagen</span>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  <div className="flex items-start gap-3 bg-brand-orange/5 border border-brand-orange/20 p-3.5 rounded-xl">
                    <span className="text-brand-orange text-sm mt-0.5 font-sans">ℹ️</span>
                    <div className="flex flex-col">
                      <span className="font-display font-black text-xs md:text-sm text-brand-orange uppercase tracking-wide leading-relaxed">
                        Bei Buchungen incl. Flug ist der Zug zum Flug enthalten !!!
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Wichtige Erklärungen & Bestätigungen */}
            <div className="space-y-6">

              {/* 1. AGBs vom Veranstalter */}
              <div className="bg-white p-4 rounded-xl border border-brand-gray space-y-3">
                <div className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider leading-relaxed">
                  1. Wir haben die <a href="https://www.aldiana.com/dam/jcr:66256be8-71f3-49ba-847f-66a79a1ca06c/ALDIANA_AGBs_Sommer_2026.2026-01-13-11-07-21.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline hover:text-brand-orange transition-colors">AGBs des Veranstalters</a> zur Kenntnis genommen <span className="text-brand-orange">*</span>
                </div>
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
                <div className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider leading-relaxed">
                  2. Über die <a href="https://www.aldiana.com/dam/jcr:d462857b-be29-4edb-b2f9-cb5efa884352/Pauschalreiserichtlinien-S2023.2025-04-25-10-13-30.pdf" target="_blank" rel="noopener noreferrer" className="text-brand-blue underline hover:text-brand-orange transition-colors">Pauschalreiserichtlinien</a> sind wir informiert <span className="text-brand-orange">*</span>
                </div>
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

              {/* 5. Gewünschte Zahlungsart */}
              <div className="bg-white p-4 rounded-xl border border-brand-gray space-y-3">
                <label className="block text-xs font-display font-black text-brand-dark-brown uppercase tracking-wider">
                  5. Bitte wählen Sie Ihre gewünschte Zahlungsart <span className="text-brand-orange">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: 'Lastschrift', label: 'Lastschrift', desc: 'Bequemer Bankeinzug' },
                    { key: 'Überweisung', label: 'Überweisung', desc: 'Zahlung per Banküberweisung' },
                    { key: 'Kreditkarte', label: 'Kreditkarte', desc: 'Bei Kontingentbuchungen zzgl. 2% Disagio' }
                  ].map(opt => {
                    const isSelected = formData.zahlungsart === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateField('zahlungsart', opt.key as any)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-full
                          ${isSelected
                            ? 'bg-brand-blue/5 border-brand-blue text-brand-blue ring-1 ring-brand-blue/30'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-brand-blue/50'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="font-display font-extrabold text-xs uppercase tracking-wider">{opt.label}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                            ${isSelected ? 'border-brand-blue bg-brand-blue' : 'border-gray-300'}
                          `}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-sans leading-snug">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.zahlungsart && <p className="text-xs text-rose-600 font-semibold font-sans">{errors.zahlungsart}</p>}

                {/* Dynamische Felder je nach gewählter Zahlungsart */}
                <AnimatePresence mode="wait">
                  {formData.zahlungsart === 'Lastschrift' && (
                    <motion.div
                      key="lastschrift-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 bg-brand-light-bg/50 border border-brand-gray rounded-xl space-y-3 overflow-hidden"
                    >
                      <h4 className="text-xs font-display font-black text-brand-dark-brown uppercase tracking-wide">
                        Angaben zum Lastschrifteinzug
                      </h4>

                      {/* Auswahl, ob Daten online eingetragen werden sollen */}
                      <div className="bg-white/70 p-3 rounded-xl border border-brand-gray flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-brand-dark-brown">
                          Wie möchten Sie uns Ihre Bankdaten übermitteln?
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateField('zahlungLastschriftDatenEingeben', 'online')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border text-center transition-all ${
                              formData.zahlungLastschriftDatenEingeben === 'online'
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Jetzt online eingeben
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('zahlungLastschriftDatenEingeben', 'telefonisch')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border text-center transition-all ${
                              formData.zahlungLastschriftDatenEingeben === 'telefonisch'
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Später auf anderem Weg (z.B. telefonisch)
                          </button>
                        </div>
                      </div>

                      {formData.zahlungLastschriftDatenEingeben === 'online' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Kontoinhaber
                            </label>
                            <input
                              type="text"
                              value={formData.zahlungKontoinhaber}
                              onChange={(e) => {
                                updateField('zahlungKontoinhaber', e.target.value);
                                if (errors.zahlungKontoinhaber) {
                                  setErrors(prev => {
                                    const c = { ...prev };
                                    delete c.zahlungKontoinhaber;
                                    return c;
                                  });
                                }
                              }}
                              className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans font-bold"
                              placeholder="Z.B. Max Mustermann"
                            />
                            {errors.zahlungKontoinhaber && (
                              <p className="text-[10px] text-rose-600 font-sans font-semibold">{errors.zahlungKontoinhaber}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              IBAN
                            </label>
                            <input
                              type="text"
                              value={formData.zahlungIban}
                              onChange={(e) => {
                                updateField('zahlungIban', e.target.value);
                                if (errors.zahlungIban) {
                                  setErrors(prev => {
                                    const c = { ...prev };
                                    delete c.zahlungIban;
                                    return c;
                                  });
                                }
                              }}
                              className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans font-mono font-bold uppercase"
                              placeholder="DE00 0000 0000 0000 0000 00"
                            />
                            {errors.zahlungIban && (
                              <p className="text-[10px] text-rose-600 font-sans font-semibold">{errors.zahlungIban}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Alternativer Hinweis unter Lastschrift */}
                      <div className="bg-brand-blue/5 border border-brand-blue/20 p-3 rounded-lg text-xs text-brand-blue font-sans flex items-start gap-2 leading-relaxed mt-2">
                        <span className="text-sm shrink-0">📞</span>
                        <div>
                          <strong>Alternativer Hinweis:</strong> Sie können uns Ihre Kontodaten auch sehr gerne <strong>telefonisch durchgeben</strong>, falls Sie diese nicht online eintragen möchten! Weisen Sie uns einfach darauf hin.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.zahlungsart === 'Kreditkarte' && (
                    <motion.div
                      key="kreditkarte-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-4 bg-brand-light-bg/50 border border-brand-gray rounded-xl space-y-3 overflow-hidden"
                    >
                      <h4 className="text-xs font-display font-black text-brand-dark-brown uppercase tracking-wide">
                        Angaben zur Kreditkarte
                      </h4>

                      {/* Auswahl, ob Daten online eingetragen werden sollen */}
                      <div className="bg-white/70 p-3 rounded-xl border border-brand-gray flex flex-col gap-2">
                        <span className="text-[11px] font-bold text-brand-dark-brown">
                          Wie möchten Sie uns Ihre Kreditkartendaten übermitteln?
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => updateField('zahlungKreditkarteDatenEingeben', 'online')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border text-center transition-all ${
                              formData.zahlungKreditkarteDatenEingeben === 'online'
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Jetzt online eingeben
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('zahlungKreditkarteDatenEingeben', 'telefonisch')}
                            className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer border text-center transition-all ${
                              formData.zahlungKreditkarteDatenEingeben === 'telefonisch'
                                ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Später auf anderem Weg (z.B. telefonisch)
                          </button>
                        </div>
                      </div>

                      {formData.zahlungKreditkarteDatenEingeben === 'online' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Karteninhaber (wie auf Karte)
                            </label>
                            <input
                              type="text"
                              value={formData.zahlungKreditkarteInhaber || ''}
                              onChange={(e) => updateField('zahlungKreditkarteInhaber', e.target.value)}
                              className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans font-bold"
                              placeholder="Z.B. MAX MUSTERMANN"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Kreditkartennummer
                            </label>
                            <input
                              type="text"
                              value={formData.zahlungKreditkarteNummer || ''}
                              onChange={(e) => updateField('zahlungKreditkarteNummer', e.target.value)}
                              className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans font-mono font-bold"
                              placeholder="4111 2222 3333 4444"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              Gültig bis (MM/JJ)
                            </label>
                            <input
                              type="text"
                              value={formData.zahlungKreditkarteGueltig || ''}
                              onChange={(e) => updateField('zahlungKreditkarteGueltig', e.target.value)}
                              className="w-full bg-white px-3 py-2 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans font-bold text-center"
                              placeholder="MM/JJ"
                            />
                          </div>
                        </div>
                      )}

                      {/* Alternativer Hinweis unter Kreditkarte */}
                      <div className="bg-brand-blue/5 border border-brand-blue/20 p-3 rounded-lg text-xs text-brand-blue font-sans flex items-start gap-2 leading-relaxed mt-2">
                        <span className="text-sm shrink-0">📞</span>
                        <div>
                          <strong>Alternativer Hinweis:</strong> Sie können uns Ihre Kreditkartendaten auch sehr gerne <strong>telefonisch durchgeben</strong>, falls Sie diese nicht online eintragen möchten! Weisen Sie uns einfach darauf hin.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
      <div className="bg-gray-50 border-t border-brand-gray/60 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-400 font-sans">
        <span>© {new Date().getFullYear()} Reisebüro art reisen GmbH, Mettmann. Alle Rechte vorbehalten.</span>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="https://artreisen.de/impressum/" target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-gray-500">Impressum</a>
          <span>•</span>
          <a href="https://artreisen.de/datenschutz/" target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-gray-500">Datenschutz</a>
          {onShowAdmin && (
            <>
              <span>•</span>
              <button type="button" onClick={onShowAdmin} className="hover:underline text-gray-400 cursor-pointer text-[9px] font-mono">Admin</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
