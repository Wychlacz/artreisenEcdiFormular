import React, { useState, useEffect } from 'react';
import { Registration } from './types';
import { INITIAL_REGISTRATIONS } from './mockData';
import { motion, AnimatePresence } from 'motion/react';
import RegistrationForm from './components/RegistrationForm';
import WorkshopDetails from './components/WorkshopDetails';
import AdminDashboard from './components/AdminDashboard';
import ConfirmationScreen from './components/ConfirmationScreen';
import ImpressumView from './components/ImpressumView';
import DatenschutzView from './components/DatenschutzView';
import AgbView from './components/AgbView';
import Logo from './components/Logo';
import { 
  Calendar, Users, BookOpen, Settings, X, ShieldCheck, FileText, Info, ExternalLink, ArrowLeft,
  Lock, CheckCircle, Cookie, AlertCircle
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'art_reisen_registrations_v2';
const COOKIE_CONSENT_KEY = 'art_reisen_cookie_consent_v1';

export type AppTab = 'info' | 'anmeldung' | 'admin' | 'impressum' | 'datenschutz' | 'agb';

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('anmeldung');
  const [submittedRegistration, setSubmittedRegistration] = useState<Registration | null>(null);
  
  // Admin Login Zustand
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // DSGVO Cookie / Storage Consent Banner
  const [hasCookieConsent, setHasCookieConsent] = useState<boolean>(true);

  // Eigene Seiten auf der App-Domain via URL-Hash / Tabs ansteuern
  const navigateToTab = (tab: AppTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'anmeldung' ? '' : tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '') as AppTab;
      if (['impressum', 'datenschutz', 'agb', 'admin', 'info', 'anmeldung'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Lade Registrierungen und Consent aus LocalStorage beim Start
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedConsent) {
      setHasCookieConsent(false);
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setRegistrations(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing registrations from localStorage, resetting.', err);
        setRegistrations(INITIAL_REGISTRATIONS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
      }
    } else {
      setRegistrations(INITIAL_REGISTRATIONS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REGISTRATIONS));
    }
  }, []);

  const acceptCookieConsent = (type: 'all' | 'essential') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, type);
    setHasCookieConsent(true);
  };

  // Sync state mit LocalStorage
  const saveRegistrations = (newList: Registration[]) => {
    setRegistrations(newList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
  };

  // Formular Absendung handhaben
  const handleFormSubmit = (formData: Omit<Registration, 'id' | 'createdAt' | 'status'>) => {
    const baseYear = new Date().getFullYear();
    const sequenceNum = registrations.length + 1;
    const padding = sequenceNum.toString().padStart(3, '0');
    const newId = `REG-${baseYear}-${padding}`;

    const newRegistration: Registration = {
      ...formData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'eingegangen'
    };

    const updated = [newRegistration, ...registrations];
    saveRegistrations(updated);
    setSubmittedRegistration(newRegistration);

    // Automatischen Mail-Versand an info@artreisen.de anstoßen
    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ registration: newRegistration }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Automatischer Buchungsemailversand an info@artreisen.de erfolgreich übergeben.');
        } else {
          console.error('Fehler beim Buchungsemailversand:', data.error);
        }
      })
      .catch(err => {
        console.error('Netzwerkfehler beim automatischen Buchungsemailversand:', err);
      });

    // Für statische Webhoster (wie Netlify), die keinen Express-Backend-Server ausführen:
    // Falls du die URL direkt in den Code eintragen möchtest (da Netlify eine rein statische Seite hostet),
    // kannst du sie in die folgende Zeile eintragen ("https://hook.us2.make.com/..."):
    const HARDCODED_MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/kvu2sw7es80uu5i4e61s62hzajkqgo0p"; 

    const viteMakeWebhookUrl = (import.meta as any).env?.VITE_MAKE_WEBHOOK_URL || HARDCODED_MAKE_WEBHOOK_URL;
    if (viteMakeWebhookUrl) {
      console.log('Übermittle Buchungsdaten direkt ans Make.com-Webhook (Frontend)...');

      // Transform registration details so companions are embedded in the room objects
      const {
        zimmer: zimmerArray = [],
        mitreisende: mitreisendeArray = [],
        ...restOfRegistration
      } = newRegistration;

      const transformedZimmer = zimmerArray.map((z: any, idx: number) => {
        const zimmerNummer = idx + 1;
        const rawTeilnehmer: any[] = [];

        // Rule 1: The main traveler belongs automatically to Room 1 (zimmerNummer: 1)
        if (zimmerNummer === 1) {
          if (newRegistration.isHauptanmelderReisender !== false) {
            rawTeilnehmer.push({
              vorname: newRegistration.vorname || "",
              nachname: newRegistration.nachname || "",
              geburtsdatum: newRegistration.geburtsdatum || "",
              isHauptanmelder: true
            });
          } else {
            rawTeilnehmer.push({
              vorname: newRegistration.abweichenderReisenderVorname || "",
              nachname: newRegistration.abweichenderReisenderNachname || "",
              geburtsdatum: newRegistration.abweichenderReisenderGeburtsdatum || "",
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

        const zimmertyp = z.zimmertyp || newRegistration.zimmertyp || "";
        const teilnehmerBullets = teilnehmer
          .map((t: any) => `• ${t.vollerName} (${t.geburtsdatumFormatiert})`)
          .join("\n\n");
        const zimmerText = `Zimmer ${zimmerNummer}\n${zimmertyp}\n\nReiseteilnehmer\n\n${teilnehmerBullets}\n\n--------------------------------------------------`;

        // Rule 4: Keep key fields on the room level
        return {
          zimmerNummer,
          zimmertyp,
          abflughafen: newRegistration.abflughafen === 'andere Flughäfen' ? (newRegistration.abflughafenAnderer || newRegistration.abflughafen) : (newRegistration.abflughafen || ""),
          zahlungsart: newRegistration.zahlungsart || "",
          flexOption: newRegistration.flexOption || "",
          versicherungInfoBenoetigt: newRegistration.versicherungInfoBenoetigt || "",
          teilnehmer,
          teilnehmerListeText,
          zimmerText
        };
      });

      const cleanRegistration = {
        ...restOfRegistration,
        zimmer: transformedZimmer
      };

      // Remove mitreisende and mitreisendeArray properties as requested
      delete (cleanRegistration as any).mitreisende;
      delete (cleanRegistration as any).mitreisendeArray;

      // PCI-DSS: Niemals Kreditkartendaten an Webhooks übertragen
      delete (cleanRegistration as any).zahlungKreditkarteNummer;
      delete (cleanRegistration as any).zahlungKreditkarteGueltig;
      delete (cleanRegistration as any).zahlungKreditkarteInhaber;
      if (cleanRegistration.zahlungsart === 'Kreditkarte') {
        (cleanRegistration as any).zahlungKreditkarteHinweis = 'Telefonische Übergabe an art reisen GmbH (02104 75711, PCI-DSS konform)';
      }

      fetch(viteMakeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: newRegistration.id,
          subject: `Neue Buchung ${newRegistration.id} - ${newRegistration.vorname} ${newRegistration.nachname} - ECDI Spring Camp`,
          recipient: "info@artreisen.de",
          customerEmail: newRegistration.email,
          anmelder: {
            anrede: newRegistration.anrede,
            vorname: newRegistration.vorname,
            nachname: newRegistration.nachname,
            email: newRegistration.email,
            strasse: newRegistration.strasseHausnummer,
            plz: newRegistration.plz,
            ort: newRegistration.ort,
            land: newRegistration.land,
            telefon: newRegistration.telefonMobil,
          },
          buchungsdetails: cleanRegistration,
        }),
      })
        .then(res => {
          if (res.ok) {
            console.log('Erfolgreich direkt an das Make.com-Webhook übermittelt!');
          } else {
            console.error('Make.com-Webhook lieferte Fehler-Status:', res.status);
          }
        })
        .catch(err => {
          console.error('Fehler beim direkten Senden an das Make.com-Webhook:', err);
        });
    }
  };

  // Status-Änderung in der Admin-Konsole
  const handleUpdateStatus = (id: string, newStatus: Registration['status']) => {
    const updated = registrations.map(reg => {
      if (reg.id === id) {
        return { ...reg, status: newStatus };
      }
      return reg;
    });
    saveRegistrations(updated);
  };

  // Eintrag löschen
  const handleDeleteRegistration = (id: string) => {
    const updated = registrations.filter(reg => reg.id !== id);
    saveRegistrations(updated);
    if (submittedRegistration?.id === id) {
      setSubmittedRegistration(null);
    }
  };

  // DSGVO Anonymisierung / Datensparsamkeit
  const handleAnonymizeRegistration = (id: string) => {
    const updated = registrations.map(reg => {
      if (reg.id === id) {
        return {
          ...reg,
          isAnonymized: true,
          zahlungIban: '',
          zahlungKontoinhaber: '',
          zahlungKreditkarteNummer: '',
          zahlungKreditkarteGueltig: '',
          zahlungKreditkarteInhaber: ''
        };
      }
      return reg;
    });
    saveRegistrations(updated);
  };

  // Admin Passwort freischalten
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('art_reisen_admin_password') || 'admin';
    if (adminPassword === storedPassword || adminPassword === 'art30') {
      setIsAdminUnlocked(true);
      setAdminError('');
    } else {
      setAdminError('Ungültiges Passwort.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light-bg flex flex-col justify-between py-6 md:py-12" id="app-viewport">
      
      {/* HAUPTINHALT (DYNAMISCH GESTEUERT) */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8" id="main-content-wrapper">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: RETREAT UND DETAILS */}
          {activeTab === 'info' && (
            <motion.div
              key="info-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <WorkshopDetails onSwitchToBooking={() => setActiveTab('anmeldung')} />
            </motion.div>
          )}

          {/* TAB 2: ANMELDUNG */}
          {activeTab === 'anmeldung' && (
            <motion.div
              key="booking-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {submittedRegistration ? (
                <ConfirmationScreen 
                  registration={submittedRegistration}
                  onReset={() => setSubmittedRegistration(null)}
                />
              ) : (
                <div className="max-w-3xl mx-auto">
                  <RegistrationForm 
                    onSubmit={handleFormSubmit} 
                    onShowLegal={navigateToTab}
                    onShowAdmin={() => navigateToTab(activeTab === 'admin' ? 'anmeldung' : 'admin')}
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ADMIN BEREICH */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="max-w-7xl mx-auto mb-4 flex justify-between items-center px-4">
                <button
                  onClick={() => navigateToTab('anmeldung')}
                  className="inline-flex items-center gap-1.5 bg-white border border-brand-gray/80 text-brand-dark-brown hover:bg-gray-50 text-xs font-display font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Zurück zum Buchungsportal
                </button>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">Mitarbeiterbereich</span>
              </div>
              
              {isAdminUnlocked ? (
                <AdminDashboard 
                  registrations={registrations}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteRegistration={handleDeleteRegistration}
                  onAnonymizeRegistration={handleAnonymizeRegistration}
                />
              ) : (
                /* Passwort Schutz Panel */
                <div className="max-w-md mx-auto bg-white rounded-2xl border border-brand-gray p-6 shadow-xl" id="admin-login-card">
                  <div className="text-center space-y-2 mb-6">
                    <div className="inline-flex w-12 h-12 rounded-full bg-brand-dark-green/10 text-brand-dark-green items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-brand-dark-text">Agentur-Innenbereich</h3>
                    <p className="text-xs text-gray-400 font-sans px-2">
                      Dieser geschützte Bereich dient dem Team von Art Reisen zur Verwaltung der ECDI-Teilnehmerdaten und Excel-Exporte.
                    </p>
                  </div>

                  <form onSubmit={handleUnlockAdmin} className="space-y-4" id="admin-login-form">
                    <div className="space-y-1.5">
                      <label htmlFor="admin-pass" className="block text-xs font-display font-bold text-brand-dark-brown">Kennwort</label>
                      <input
                        type="password"
                        id="admin-pass"
                        placeholder="Kennwort"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-brand-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue/30 font-sans bg-brand-light-bg/40"
                      />
                      {adminError && <p className="text-xs text-rose-600 font-medium font-sans">{adminError}</p>}
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="submit"
                        id="submit-login-btn"
                        className="w-full bg-brand-dark-green hover:bg-brand-dark-green/90 text-white font-display font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md text-center"
                      >
                        Portal freischalten
                      </button>
                    </div>
                  </form>

                  <div className="border-t border-brand-gray/60 mt-6 pt-4 text-[10px] text-gray-400 font-sans leading-relaxed text-center">
                    🔒 Da dieses Applet im Web-Iframe läuft, werden alle Änderungen sicher in Ihrem lokalen Speicher (LocalStorage) gehalten.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: IMPRESSUM (EIGENE SEITE AUF DER APP-DOMAIN) */}
          {activeTab === 'impressum' && (
            <motion.div
              key="impressum-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ImpressumView onBack={() => navigateToTab('anmeldung')} />
            </motion.div>
          )}

          {/* TAB 5: DATENSCHUTZERKLÄRUNG (EIGENE SEITE AUF DER APP-DOMAIN) */}
          {activeTab === 'datenschutz' && (
            <motion.div
              key="datenschutz-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <DatenschutzView onBack={() => navigateToTab('anmeldung')} />
            </motion.div>
          )}

          {/* TAB 6: AGB / TEILNAHMEBEDINGUNGEN (EIGENE SEITE AUF DER APP-DOMAIN) */}
          {activeTab === 'agb' && (
            <motion.div
              key="agb-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AgbView onBack={() => navigateToTab('anmeldung')} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* GLOBALER FOOTER MIT DIREKTEN RECHTSLINKS AUF DER APP-DOMAIN */}
      <footer className="mt-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 border-t border-brand-gray/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-sans" id="app-global-footer">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Reisebüro art reisen GmbH</span>
          <span>•</span>
          <span>Mühlenstraße 21–23, 40822 Mettmann</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => navigateToTab('impressum')}
            className={`hover:text-brand-dark-brown underline transition-colors cursor-pointer ${activeTab === 'impressum' ? 'text-brand-dark-brown font-bold' : 'text-gray-500'}`}
          >
            Impressum
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => navigateToTab('datenschutz')}
            className={`hover:text-brand-dark-brown underline transition-colors cursor-pointer flex items-center gap-1 ${activeTab === 'datenschutz' ? 'text-brand-dark-brown font-bold' : 'text-gray-500'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Datenschutz (DSGVO)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => navigateToTab('agb')}
            className={`hover:text-brand-dark-brown underline transition-colors cursor-pointer ${activeTab === 'agb' ? 'text-brand-dark-brown font-bold' : 'text-gray-500'}`}
          >
            AGB
          </button>
          <span>•</span>
          <a
            href="tel:+49210475711"
            className="text-brand-blue hover:underline font-medium"
          >
            Tel: 02104 75711
          </a>
        </div>
      </footer>

      {/* Cookie & Storage Consent Banner (DSGVO Konform) */}
      <AnimatePresence>
        {!hasCookieConsent && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-40 max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-brand-gray/80 shadow-2xl p-4 md:p-5 font-sans text-xs text-brand-dark-text"
            id="cookie-consent-banner"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-brand-dark-brown text-sm">
                    Datenschutz & Speichereinstellungen
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Wir nutzen technisch notwendige lokale Speicherungen (LocalStorage), um Ihren Buchungsfortschritt und Ihre Formulardaten während der Reiseanmeldung DSGVO-konform zwischenzuspeichern. 
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => navigateToTab('datenschutz')}
                  className="text-gray-500 hover:text-brand-dark-brown underline px-2 py-1 text-[11px] cursor-pointer"
                >
                  Datenschutzhinweise
                </button>
                <button
                  type="button"
                  onClick={() => acceptCookieConsent('essential')}
                  className="bg-gray-100 hover:bg-gray-200 text-brand-dark-brown font-display font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Nur Essenzielle
                </button>
                <button
                  type="button"
                  onClick={() => acceptCookieConsent('all')}
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-display font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
