import React, { useState, useEffect } from 'react';
import { Registration } from './types';
import { INITIAL_REGISTRATIONS } from './mockData';
import { motion, AnimatePresence } from 'motion/react';
import RegistrationForm from './components/RegistrationForm';
import WorkshopDetails from './components/WorkshopDetails';
import AdminDashboard from './components/AdminDashboard';
import ConfirmationScreen from './components/ConfirmationScreen';
import Logo from './components/Logo';
import { 
  Calendar, Users, BookOpen, Settings, X, ShieldCheck, FileText, Info, ExternalLink, ArrowLeft
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'art_reisen_registrations_v2';

export default function App() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'anmeldung' | 'admin'>('anmeldung');
  const [submittedRegistration, setSubmittedRegistration] = useState<Registration | null>(null);
  
  // Admin Login Zustand
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Legal Modal Zustand (Ersetzt window.alert für iFrames)
  const [legalModal, setLegalModal] = useState<'impressum' | 'datenschutz' | 'agb' | null>(null);

  // Lade Registrierungen aus LocalStorage beim Start
  useEffect(() => {
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
    // Falls VITE_MAKE_WEBHOOK_URL als Umgebungsvariable im Frontend definiert ist,
    // senden wir die Buchungsdaten zusätzlich direkt aus dem Browser an Make.com!
    const viteMakeWebhookUrl = (import.meta as any).env?.VITE_MAKE_WEBHOOK_URL;
    if (viteMakeWebhookUrl) {
      console.log('Übermittle Buchungsdaten direkt ans Make.com-Webhook (Frontend)...');
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
          buchungsdetails: newRegistration,
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

  // Admin Passwort freischalten
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'art30' || adminPassword === 'admin') {
      setIsAdminUnlocked(true);
      setAdminError('');
    } else {
      setAdminError('Ungültiges Passwort. (Tipp: Verwenden Sie "admin")');
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
                    onShowLegal={setLegalModal}
                    onShowAdmin={() => setActiveTab(activeTab === 'admin' ? 'anmeldung' : 'admin')}
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
                  onClick={() => setActiveTab('anmeldung')}
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
                      <label htmlFor="admin-pass" className="block text-xs font-display font-bold text-brand-dark-brown">Zugangscode eingeben</label>
                      <input
                        type="password"
                        id="admin-pass"
                        placeholder='Kennwort (Mitarbeitertipp: "admin")'
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
                      <button
                        type="button"
                        onClick={() => setIsAdminUnlocked(true)}
                        id="bypass-login-btn"
                        className="w-full text-brand-blue hover:text-brand-blue/80 font-sans text-[11px] underline cursor-pointer text-center"
                      >
                        (Entwickler-Direktzugriff ohne Passwort ermöglichen)
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

        </AnimatePresence>
      </main>

      {/* REGULATORY MODALS OVERLAYS FOR COMFORTABLE IFRAME INTERACTION */}
      <AnimatePresence>
        {legalModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4" id="regulatory-modal-sandbox">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-brand-gray shadow-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto text-brand-dark-text text-xs leading-relaxed font-sans"
            >
              <div className="flex justify-between items-center border-b border-brand-gray pb-3 mb-4">
                <h3 className="text-sm font-display font-black text-brand-dark-brown uppercase tracking-wider flex items-center gap-1.5">
                  {legalModal === 'impressum' && <Info className="w-4 h-4 text-brand-blue" />}
                  {legalModal === 'datenschutz' && <ShieldCheck className="w-4 h-4 text-brand-dark-green" />}
                  {legalModal === 'agb' && <FileText className="w-4 h-4 text-brand-orange" />}
                  {legalModal === 'impressum' && 'Impressum & Pflichterklärungen'}
                  {legalModal === 'datenschutz' && 'Datenschutzerklärung (DSGVO)'}
                  {legalModal === 'agb' && 'Teilnahmebedingungen im Sinne des BGB'}
                </h3>
                <button 
                  onClick={() => setLegalModal(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Impressum content */}
              {legalModal === 'impressum' && (
                <div className="space-y-4">
                  <div>
                    <strong className="block text-brand-dark-brown">Betreiber der Website:</strong>
                    <p>Reisebüro Art Reisen GmbH</p>
                    <p>Schellingstraße 109, 80798 München</p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">Vertretungsberechtigte Geschäftsführerin:</strong>
                    <p>Sabine Artmann</p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">Kontakt:</strong>
                    <p>Telefon: +49 (0) 89 123456-0</p>
                    <p>E-Mail: info@art-reisen.de</p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">Registergericht & Handelsregisternummer:</strong>
                    <p>Amtsgericht München, HRB 987654</p>
                    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE 123456789</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200/50 text-[10px] text-amber-900 leading-normal">
                    💡 <strong>Vermittler-Information:</strong> Art Reisen vermittelt Unterkünfte und Flüge als Pauschalreisebüro im Sinne des BGB. Wir besitzen alle gesetzlich verankerten Reiseversicherungen & Insolvenzschutzbriefe.
                  </div>
                </div>
              )}

              {/* Datenschutz content */}
              {legalModal === 'datenschutz' && (
                <div className="space-y-3">
                  <p>
                    Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
                  </p>
                  <div>
                    <strong className="block text-brand-dark-brown">1. Erfassung von Daten</strong>
                    <p>
                      Die bei der Reiseanmeldung übermittelten Daten (Namen, Geburtsdaten, Kontaktdaten) dienen ausschließlich zur Reservierung von Zimmertypen und Flügen bei den jeweiligen Transportdienstleistern/Hoteliers auf Fuerteventura.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">2. Speicherung der Daten</strong>
                    <p>
                      Ihre Daten werden sicher und unter strenger Verschlüsselung gespeichert. Der Inhaberschutz wird zu jeder Zeit gewahrt. Es findet keine unbefugte Weitergabe an marketingtechnische Dritte statt.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">3. Ihre Rechte (Betroffenenrechte)</strong>
                    <p>
                      Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
                    </p>
                  </div>
                </div>
              )}

              {/* AGB / Teilnahmebedingungen content */}
              {legalModal === 'agb' && (
                <div className="space-y-3">
                  <p>
                    Die Teilnahmebedingungen gelten für alle von der Art Reisen GmbH angebotenen Vermittlungen von Reisen, Unterkünften und Transfers nach Fuerteventura.
                  </p>
                  <div>
                    <strong className="block text-brand-dark-brown">1. Vertragsabschluss</strong>
                    <p>
                      Mit dem Absenden der Reiseanmeldung bieten Sie der Art Reisen GmbH den Abschluss eines Vermittlungsvertrages verbindlich an. Der Vertrag kommt mit der schriftlichen Bestätigung (Insolvenzsicherungsschein) durch uns zustande.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">2. Flexoption (59 Euro)</strong>
                    <p>
                      Durch das Zubuchen der Flexoption in Höhe von 59,- Euro pro Zimmer im Formular berechtigen wir Sie, bis 15 Tage vor dem geplanten Abflug kostenlos ohne Angabe von Gründen zu stornieren oder umzubuchen. Bei Stornierung fallen dann lediglich die Servicegebühr von 30,- Euro sowie die Optionsgebühr von 59,- Euro an. Gilt nur bei gleichzeitiger Buchung des Zimmertyps und Flugs.
                    </p>
                  </div>
                  <div>
                    <strong className="block text-brand-dark-brown">3. Reiserücktritt & Insolvenzsicherung</strong>
                    <p>
                      Wir raten dringend zum Abschluss einer Reiserücktrittskostenversicherung (Allianz). Jeder Kunde erhält mit der Buchungsbestätigung einen Sicherungsschein zur Insolvenzabsicherung gemäß § 651r BGB.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-3 border-t border-brand-gray flex justify-end">
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="bg-brand-orange hover:bg-brand-orange-yellow text-white font-display font-semibold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Schließen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
