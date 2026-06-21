import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, Compass, Sun, Ship, Compass as CompassIcon, 
  Check, CheckSquare, Square, Info, Sparkles, MapPin, ExternalLink 
} from 'lucide-react';

interface WorkshopDetailsProps {
  onSwitchToBooking?: () => void;
}

export default function WorkshopDetails({ onSwitchToBooking }: WorkshopDetailsProps) {
  const [scientificRegistered, setScientificRegistered] = useState(false);
  const [packList, setPackList] = useState([
    { id: 1, text: 'Bequeme Freizeit- & Seminarbekleidung', checked: true, category: 'Kleidung' },
    { id: 2, text: 'Windjacke (Fuerteventura kann windig sein)', checked: false, category: 'Kleidung' },
    { id: 3, text: 'Badebekleidung & Strandtuch', checked: false, category: 'Kleidung' },
    { id: 4, text: 'Sonnenschutz (LSF 30+, Sonnenbrille, Hut)', checked: true, category: 'Schutz' },
    { id: 5, text: 'Persönliche Reiseapotheke & Medikamente', checked: false, category: 'Schutz' },
    { id: 6, text: 'Eigenes Notizbuch und Lieblingsschreiber', checked: true, category: 'ECDI-Seminar' },
    { id: 7, text: 'Yogamatte oder leichtes Tuch (falls vorhanden)', checked: false, category: 'ECDI-Seminar' },
    { id: 8, text: 'Personalausweis/Reisepass (min. 3 Monate gültig)', checked: true, category: 'Dokumente' },
    { id: 9, text: 'Krankenkassenkarte & Auslandskrankenversicherung', checked: false, category: 'Dokumente' },
  ]);

  const togglePackItem = (id: number) => {
    setPackList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const categories = Array.from(new Set(packList.map(item => item.category)));

  return (
    <div className="space-y-8" id="workshop-details-root">
      {/* Hero-Bannercard mit generiertem Bild */}
      <div className="relative overflow-hidden rounded-2xl border border-brand-gray/80 shadow-lg bg-brand-dark-brown/95 text-white" id="workshop-hero-banner">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/fuerte_workshop_1781975133305.jpg" 
            alt="ECDI Workshop Fuerteventura Beach View"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-brown/90 via-brand-dark-brown/40 to-transparent" />
        </div>

        <div className="relative z-10 p-8 lg:p-12 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark-brown font-display text-xs font-bold px-3.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
            ☀️ Exklusiver Seminar-Workshop
          </div>
          <h1 className="text-3xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight">
            ECDI-Intensiv-Retreat <br />
            <span className="text-brand-orange-yellow text-glow">auf Fuerteventura</span>
          </h1>
          <p className="text-gray-100 font-sans text-md lg:text-lg max-w-2xl leading-relaxed">
            Eine Reise zur inneren Balance, Klarheit und Selbsterkenntnis. Finden Sie neue Perspektiven inmitten der atemberaubenden Naturkulisse des Atlantiks. In Zusammenarbeit mit dem traditionsreichen inhabergeführten Reisebüro <strong>Art Reisen</strong>.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm font-display text-gray-200" id="hero-quick-facts">
            <span className="flex items-center gap-1.5"><Sun className="w-5 h-5 text-brand-yellow" /> Ganzjährige milde 22-26°C</span>
            <span className="flex items-center gap-1.5"><CompassIcon className="w-5 h-5 text-brand-orange" /> Kraftort am Meer</span>
            <span className="flex items-center gap-1.5"><Building2 className="w-5 h-5 text-brand-blue" /> Exklusives Wellness-Resort</span>
          </div>
        </div>
      </div>

      {/* Interaktiver Anmelde-Ablauf-Organisator */}
      <div className="bg-gradient-to-br from-[#0f223d]/5 to-transparent p-6 rounded-2xl border-2 border-brand-blue/30 shadow-xs" id="registration-steps-guide">
        <h3 className="text-lg font-display font-bold text-brand-dark-blue flex items-center gap-2 mb-3">
          <CheckSquare className="w-5 h-5 text-brand-blue" />
          Ihre Anmeldung in 2 einfachen Schritten:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Schritt 1 */}
          <div className="bg-white p-5 rounded-xl border border-brand-gray flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] font-display font-black px-3 py-1 rounded-bl-lg">
              SCHRITT 1
            </div>
            
            <div className="space-y-2.5">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-blue block">
                Wissenschaftliches Programm (ECDI)
              </span>
              <h4 className="text-md font-display font-bold text-brand-dark-blue">
                Seminaranmeldung &amp; Teilnahmevertrag
              </h4>
              <p className="text-xs text-gray-500 leading-normal">
                Registrieren Sie sich zuerst für das offizielle wissenschaftliche Programm direkt beim <strong>ECDI</strong> (European Companion &amp; Development Institute), um sich Ihren Seminarplatz und Ihre Fortbildungspunkte zu sichern.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-brand-gray/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="checkbox-scientific-registered"
                  checked={scientificRegistered}
                  onChange={(e) => setScientificRegistered(e.target.checked)}
                  className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue cursor-pointer"
                />
                <label htmlFor="checkbox-scientific-registered" className="text-xs font-sans font-semibold text-brand-dark-blue cursor-pointer select-none">
                  Bereits beim ECDI angemeldet
                </label>
              </div>
              <a 
                href="https://boeld.regasus.de/online/personal;jsessionid=MIfQhCoa-qOiEpxrVJggsg-yEgiENIr61GuEwuo7.e94f5500c711" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-display font-bold text-white bg-brand-blue hover:bg-brand-blue/95 hover:shadow-sm px-4 py-2 rounded-xl transition-all"
              >
                Zur Online-Anmeldung <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Schritt 2 */}
          <div className="bg-white p-5 rounded-xl border border-brand-gray flex flex-col justify-between relative overflow-hidden">
            <div className={`absolute top-0 right-0 text-[10px] font-display font-black px-3 py-1 rounded-bl-lg transition-colors duration-300
              ${scientificRegistered ? 'bg-brand-orange text-white' : 'bg-gray-100 text-gray-400'}
            `}>
              SCHRITT 2
            </div>
            
            <div className="space-y-2.5">
              <span className={`text-xs font-display font-bold uppercase tracking-wider block transition-colors duration-300
                ${scientificRegistered ? 'text-brand-orange' : 'text-gray-400'}
              `}>
                Hotelunterkunft &amp; Transfer (Art Reisen)
              </span>
              <h4 className="text-md font-display font-bold text-brand-dark-blue">
                Unterkunft auf Fuerteventura buchen
              </h4>
              <p className="text-xs text-gray-500 leading-normal">
                Buchen Sie jetzt Ihr exklusives Unterkunftspaket (Sonderkontingent im Wellness-Resort), Flüge, Versicherungen sowie den Premium-Transfer direkt über unser Partner-Reisebüro <strong>Art Reisen</strong>.
              </p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-brand-gray/50">
              <button
                type="button"
                onClick={onSwitchToBooking}
                className={`w-full inline-flex items-center justify-center gap-1.5 font-display font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer shadow-xs
                  ${scientificRegistered 
                    ? 'bg-brand-orange hover:bg-brand-orange-yellow text-white animate-pulse' 
                    : 'bg-brand-dark-blue hover:bg-brand-dark-blue/90 text-white'
                  }
                `}
              >
                <span>Unterkunft jetzt buchen</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Art Reisen & ECDI Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ECDI Info */}
        <div className="bg-white p-6 rounded-2xl border border-brand-gray shadow-xs flex flex-col justify-between" id="ecdi-concept-info">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-semibold text-brand-dark-brown flex items-center gap-2 border-b border-brand-gray pb-2">
              <Sparkles className="w-5 h-5 text-brand-blue" />
              Was ist die ECDI-Methode?
            </h3>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Die <strong>ECDI-Methode (Enneagramm & Coping Dynamics Indicator)</strong> kombiniert jahrtausendealtes psychologisches Wissen über die Grundcharaktere der Menschen mit modernsten wissenschaftlichen Strategien zur Stressprävention und Resilienz.
            </p>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Unterstützt von erfahrenen Mentoren decken Sie wiederkehrende Verhaltensmuster und innere &quot;Zensoren&quot; auf, um ungenutztes Potenzial freizulegen. Dieser Workshop richtet sich speziell an Menschen in Umbruchphasen, Führungskräfte sowie alle, die tiefe Klarheit über ihren Lebensweg erlangen möchten.
            </p>
            <div className="bg-brand-light-bg/50 p-4 rounded-xl border border-brand-gray/60 space-y-2" id="ecdi-learnings">
              <span className="text-xs font-display font-semibold uppercase tracking-wider text-brand-orange block">Lerninhalte & Benefits:</span>
              <ul className="text-xs text-gray-700 space-y-1.5 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  Eigene Coping-Mechanismen (Bewältigungsstrategien) verstehen
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  Stressauslöser erkennen und aktiv abbauen
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  Persönliche Resilienz für Alltag und Beruf stärken
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  Achtsamkeitspraktiken directly on the beachfront
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-brand-gray text-[11px] text-gray-400 font-sans flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-brand-blue" />
            Für Anfänger und Fortgeschrittene gleichermaßen geeignet.
          </div>
        </div>

        {/* Art Reisen Info */}
        <div className="bg-white p-6 rounded-2xl border border-brand-gray shadow-xs flex flex-col justify-between" id="art-reisen-legacy">
          <div className="space-y-4">
            <h3 className="text-xl font-display font-semibold text-brand-dark-brown flex items-center gap-2 border-b border-brand-gray pb-2">
              <Building2 className="w-5 h-5 text-brand-orange" />
              Über das Reisebüro Art Reisen
            </h3>
            <div className="flex items-center gap-4 bg-brand-light-bg p-3 rounded-xl border border-brand-gray/40">
              <div className="text-center shrink-0 bg-brand-orange text-white font-display px-3 py-1.5 rounded-lg">
                <span className="block text-xl font-bold">30+</span>
                <span className="block text-[8px] uppercase font-bold tracking-wider">Jahre</span>
              </div>
              <p className="text-xs text-brand-dark-brown font-display font-medium leading-normal">
                Anspruchsvolle, kuratierte und inhabergeführte Individualreisen mit Vertrauensgarantie.
              </p>
            </div>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Seit über drei Jahrzehnten steht Art Reisen für erstklassige Reiseplanung, persönlichen Service und absolute Diskretion. Jedes Hotelschnäppchen weicht bei uns bewusstem, qualitativem Reisen. 
            </p>
            <p className="text-gray-600 font-sans text-sm leading-relaxed">
              Bei unseren Seminaren legen wir höchsten Wert auf komfortable, naturnahe Unterkünfte, ein anregendes kulinarisches Rahmenprogramm sowie erfahrene, zertifizierte Mentoren und Workshopleiter.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-brand-gray flex items-center justify-between text-xs font-sans text-brand-blue" id="art-reisen-footer">
            <span className="font-semibold">📞 Fragen zur Buchung? +49 (0) 89 123456-0</span>
            <span className="flex items-center gap-0.5 hover:underline cursor-pointer">art-reisen.de <ExternalLink className="w-3 h-3" /></span>
          </div>
        </div>
      </div>

      {/* Interaktive Packliste */}
      <div className="bg-white p-6 rounded-2xl border border-brand-gray shadow-xs" id="packlist-checklist-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-gray pb-3 mb-4">
          <div>
            <h3 className="text-xl font-display font-semibold text-brand-dark-brown flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-dark-green" />
              Interaktive Packliste für Fuerteventura
            </h3>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              Haken Sie ein, was Sie bereits bereitgelegt haben. Die Liste wird lokal in Ihrem Browser zwischengespeichert.
            </p>
          </div>
          <div className="text-xs font-display font-semibold text-brand-dark-green bg-brand-dark-green/10 px-3 py-1.5 rounded-lg shrink-0">
            ✓ Ready: {packList.filter(p => p.checked).length} von {packList.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map(cat => (
            <div key={cat} className="space-y-2">
              <span className="text-xs font-display font-bold uppercase tracking-wider text-brand-dark-brown opacity-80 block pb-1 border-b border-brand-gray/50">
                {cat}
              </span>
              <div className="space-y-1.5">
                {packList.filter(item => item.category === cat).map(item => (
                  <button
                    key={item.id}
                    onClick={() => togglePackItem(item.id)}
                    className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-brand-light-bg/50 transition-colors cursor-pointer group focus:outline-none"
                  >
                    <span className="shrink-0 mt-0.5">
                      {item.checked ? (
                        <Check className="w-4.5 h-4.5 text-brand-dark-green bg-brand-dark-green/10 rounded border border-brand-dark-green p-0.5" />
                      ) : (
                        <span className="w-4.5 h-4.5 border-2 border-brand-gray rounded block group-hover:border-gray-400 bg-white" />
                      )}
                    </span>
                    <span className={`text-xs font-sans transition-all leading-normal
                      ${item.checked ? 'text-gray-400 line-through' : 'text-brand-dark-text'}
                    `}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reiseort Fuerteventura Info */}
      <div className="bg-white p-6 rounded-2xl border border-brand-gray shadow-xs" id="destination-map-simulation">
        <h3 className="text-xl font-display font-semibold text-brand-dark-brown flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-brand-orange" />
          Der Seminarort: Corralejo, Fuerteventura
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3 font-sans text-sm text-gray-600">
            <p className="leading-relaxed">
              Der Workshop findet in einem ausgewählten <strong>4-Sterne Wellness- und Aktiv-Resort</strong> im charmanten Norden von Fuerteventura statt.
            </p>
            <p className="leading-relaxed">
              Die Seminareinheiten werden abwechselnd im windgeschützten Seminar-Pavillon sowie im schattigen Freiluftdeck unmittelbar am Strand abgehalten. Das monotone Rauschen des Ozeans unterstützt die Konzentration und Beruhigung des Nervensystems maßgeblich.
            </p>
            <div className="bg-brand-light-bg p-3 border border-brand-gray rounded-xl space-y-1 text-xs text-brand-dark-brown">
              <strong className="block font-display font-bold text-xs uppercase tracking-wide">Anreisehinweis:</strong>
              Flug nach Puerto del Rosario (FUE). Ein exklusiver Shuttle-Service von Art Reisen holt Sie direkt am Terminal ab und bringt Sie in nur 35 Minuten zum Resort. Offene Transfers sind im Seminarpreis inklusive!
            </div>
          </div>
          
          {/* Map Simulation */}
          <div className="lg:col-span-2 h-[220px] rounded-xl border border-brand-gray overflow-hidden relative shadow-inner bg-sky-50 flex items-center justify-center">
            {/* Abstrakt gezeichnete Fuerteventura Karte */}
            <div className="absolute inset-0 bg-sky-50/50 flex flex-col items-center justify-center p-4">
              <div className="w-48 h-48 rounded-full border border-sky-200/40 relative opacity-40 animate-pulse">
                <div className="w-full h-full border border-sky-300/20 rounded-full scale-125 duration-1000" />
              </div>
            </div>
            {/* Visual elements */}
            <div className="relative text-center z-10 p-6">
              <span className="font-display font-bold text-brand-blue uppercase tracking-widest text-xs block">Kanarische Inseln</span>
              <span className="font-display font-extrabold text-2xl text-brand-dark-brown block mt-1">FUERTEVENTURA</span>
              <span className="text-xs text-gray-500 font-sans block mt-1">28.7295° N, 13.8706° W • Hotel Oasis Beach Wellness</span>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-white text-[11px] font-semibold text-brand-orange border border-brand-orange/40 rounded-full px-4 py-1.5 shadow-md">
                <MapPin className="w-3.5 h-3.5 fill-brand-orange animate-bounce" /> Seminarort: Corralejo Beach
              </div>
            </div>
            
            {/* Ocean Waves */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-brand-blue/10 backdrop-blur-xs flex items-center justify-around overflow-hidden">
              <span className="block w-20 h-2 bg-white/40 rounded-full animate-wave-slow" />
              <span className="block w-20 h-2 bg-white/40 rounded-full animate-wave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
