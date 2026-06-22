import React, { useState } from 'react';
import { Registration } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, BedDouble, Award, Search, Filter, 
  Download, Trash2, CheckCircle, X, AlertTriangle, User, Calendar, Plane, ShieldCheck, Heart
} from 'lucide-react';
import { ROOM_TYPES, DEPARTURE_AIRPORTS } from '../mockData';

interface AdminDashboardProps {
  registrations: Registration[];
  onUpdateStatus: (id: string, newStatus: Registration['status']) => void;
  onDeleteRegistration: (id: string) => void;
}

export default function AdminDashboard({
  registrations,
  onUpdateStatus,
  onDeleteRegistration
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [airportFilter, setAirportFilter] = useState<string>('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter Logik
  const filteredRegs = registrations.filter(reg => {
    const mainName = `${reg.vorname} ${reg.nachname}`.toLowerCase();
    const companionNames = reg.mitreisende.map(mr => `${mr.vorname} ${mr.nachname}`).join(' ').toLowerCase();
    
    const matchesSearch = 
      mainName.includes(searchTerm.toLowerCase()) ||
      companionNames.includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.ort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    const matchesRoom = roomFilter === 'all' || reg.zimmertyp === roomFilter;
    
    let matchesAirport = true;
    if (airportFilter !== 'all') {
      matchesAirport = reg.abflughafen === airportFilter || (airportFilter === 'Anderer' && reg.abflughafen === 'andere Flughäfen');
    }

    return matchesSearch && matchesStatus && matchesRoom && matchesAirport;
  });

  // Statistik-Berechnungen
  const stats = {
    totalBookings: registrations.length,
    activeBookings: registrations.filter(r => r.status !== 'storniert').length,
    totalPeople: registrations.filter(r => r.status !== 'storniert').reduce((sum, r) => sum + r.personenAnzahl, 0),
    flexOptionTrueCount: registrations.filter(r => r.status !== 'storniert' && r.flexOption === 'Ja').length,
    zusatzWünscheCount: registrations.filter(r => r.status !== 'storniert' && (r.zusatzVerlaengerung || r.zusatzBeachten || r.zusatzSitzplatz || r.zusatzPrivatTransfer || r.zusatzVersicherungAngebot || r.zusatzRailAndFly)).length,
  };

  // CSV-Export Funktion
  const handleCsvExport = () => {
    const headers = [
      'Buchungsnummer', 'Erstellt am', 'Status', 'Anrede (Hauptgast)', 'Vorname (Hauptgast)', 'Nachname (Hauptgast)',
      'Geburtsdatum', 'Strasse', 'PLZ', 'Ort', 'Land', 'Mobiltelefon', 'E-Mail',
      'Personen Anzahl', 'Mitreisende Details',
      'Abflughafen', 'Abflughafen Anderer', 'Zimmertyp',
      'AGB Kenntnis', 'Pauschalreise Richtlinie', 'Ruecktritt Info', 'Flexoption', 'Zahlungsart', 'Zahlungsdetails',
      'Verlaengerung Wunsch', 'Verlaengerung Zeitraum', 'Hinweise Beachten', 'Hinweise Text',
      'Sitzplatz Wunsch', 'Sitzplatz Text', 'Privat-Transfer / Mietwagen', 'Versicherung Angebot', 'Rail & Fly'
    ];

    const rows = filteredRegs.map(reg => {
      const companionDetails = reg.mitreisende.map((mr, i) => `${mr.vorname} ${mr.nachname} (Geb: ${mr.geburtsdatum})`).join(' | ');
      return [
        reg.id,
        reg.createdAt,
        reg.status,
        reg.anrede,
        reg.vorname,
        reg.nachname,
        reg.geburtsdatum,
        reg.strasseHausnummer,
        reg.plz,
        reg.ort,
        reg.land,
        reg.telefonMobil,
        reg.email,
        reg.personenAnzahl,
        companionDetails,
        reg.abflughafen,
        reg.abflughafenAnderer || '',
        reg.zimmer && reg.zimmer.length > 0 ? reg.zimmer.map((z, idx) => `Zimmer ${idx+1} (${z.gaesteAnzahl} Belegung): ${z.zimmertyp || 'N/A'}`).join(' | ') : reg.zimmertyp,
        reg.agbKenntnis,
        reg.pauschalreiseRichtlinien,
        reg.versicherungInfoBenoetigt,
        reg.flexOption,
        reg.zahlungsart || 'Keine Angabe',
        reg.zahlungsart === 'Lastschrift' 
          ? `IBAN: ${reg.zahlungIban || ''} | Inhaber: ${reg.zahlungKontoinhaber || ''}`
          : reg.zahlungsart === 'Kreditkarte'
            ? `Inhaber: ${reg.zahlungKreditkarteInhaber || ''} | Nummer: ${reg.zahlungKreditkarteNummer || ''} | Gueltig: ${reg.zahlungKreditkarteGueltig || ''}`
            : '',
        reg.zusatzVerlaengerung ? 'Ja' : 'Nein',
        reg.zusatzVerlaengerungText || '',
        reg.zusatzBeachten ? 'Ja' : 'Nein',
        reg.zusatzBeachtenText || '',
        reg.zusatzSitzplatz ? 'Ja' : 'Nein',
        reg.zusatzSitzplatzText || '',
        reg.zusatzPrivatTransfer ? `Ja (${[reg.zusatzTransferAuswahlPrivat && 'Privattransfer', reg.zusatzTransferAuswahlMietwagen && 'Mietwagen'].filter(Boolean).join(' + ')})` : 'Nein',
        reg.zusatzVersicherungAngebot ? 'Ja' : 'Nein',
        reg.zusatzRailAndFly ? 'Ja' : 'Nein'
      ];
    });

    const csvContent = "\uFEFF" + [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `art_reisen_anmeldungen_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/45 backdrop-blur-md rounded-2xl border border-brand-gray/80 p-6 shadow-xl" id="admin-dashboard-root">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-brand-dark-brown flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-blue" />
            Reisebüro Art Reisen - CRS Portal
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Interne Übersicht der Buchungsverkehre & Kunden-Zusatzleistungen für Fuerteventura.
          </p>
        </div>
        <button
          onClick={handleCsvExport}
          disabled={filteredRegs.length === 0}
          id="export-csv-btn"
          className="flex items-center gap-2 bg-brand-blue hover:bg-brand-blue/90 disabled:bg-gray-300 text-white font-display font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all self-stretch lg:self-auto justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Liste als CSV (für Excel) exportieren
        </button>
      </div>

      {/* KPI Kacheln */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="dashboard-statistics">
        {/* Buchungen */}
        <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-blue/10 text-brand-blue rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">Buchungen</p>
            <p className="text-xl font-display font-black text-brand-dark-text mt-0.5">
              {stats.activeBookings} <span className="text-xs text-gray-400 font-normal">({stats.totalBookings} ges.)</span>
            </p>
          </div>
        </div>

        {/* Personen */}
        <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-orange/10 text-brand-orange rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">Gäste gesamt</p>
            <p className="text-xl font-display font-black text-brand-dark-text mt-0.5">{stats.totalPeople} Pers.</p>
          </div>
        </div>

        {/* Flexoption */}
        <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-brand-dark-green/10 text-brand-dark-green rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">mit Flexoption</p>
            <p className="text-xl font-display font-black text-brand-dark-text mt-0.5">{stats.flexOptionTrueCount} Zimmer</p>
          </div>
        </div>

        {/* Wünsche */}
        <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center shrink-0 border border-amber-200/50">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">Zusatzwünsche</p>
            <p className="text-xl font-display font-black text-brand-dark-brown mt-0.5">{stats.zusatzWünscheCount} Buchungen</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-xs flex flex-col gap-4 mb-6" id="dashboard-filters">
        <div className="flex items-center gap-2 text-brand-dark-brown font-display font-bold text-xs uppercase tracking-wide pb-2 border-b border-brand-gray">
          <Filter className="w-4 h-4 text-brand-orange" />
          CRS Filterleiste
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Suche */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Hauptgast, Mitreisender, E-Mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue bg-brand-light-bg/30 font-sans"
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-sans text-brand-dark-text"
            >
              <option value="all">Alle Statuswerte</option>
              <option value="eingegangen">Eingegangen 📩</option>
              <option value="in_bearbeitung">In Arbeit ⚙️</option>
              <option value="bestaetigt">Bestätigt ☀️</option>
              <option value="storniert">Storniert ❌</option>
            </select>
          </div>

          {/* Zimmertyp */}
          <div>
            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-sans text-brand-dark-text"
            >
              <option value="all">Alle Zimmerkategorien</option>
              {ROOM_TYPES.map(rt => (
                <option key={rt} value={rt}>{rt}</option>
              ))}
            </select>
          </div>

          {/* Abflughafen */}
          <div>
            <select
              value={airportFilter}
              onChange={(e) => setAirportFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-brand-gray rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-blue bg-white font-sans text-brand-dark-text"
            >
              <option value="all">Alle Abflughäfen</option>
              {DEPARTURE_AIRPORTS.map(ap => (
                <option key={ap} value={ap}>{ap.slice(0, 20)}</option>
              ))}
              <option value="Anderer">Anderer Abflughafen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabelle */}
      <div className="bg-white rounded-xl border border-brand-gray shadow-xs overflow-hidden" id="dashboard-registrations-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-gray/45 border-b border-brand-gray text-gray-500 font-display font-semibold text-[10px] uppercase tracking-wider">
                <th className="px-4 py-3">Buchungs-Referenz</th>
                <th className="px-4 py-3">Hauptreisende/r</th>
                <th className="px-4 py-3 text-center">Personen</th>
                <th className="px-4 py-3">Flug & Abflughafen</th>
                <th className="px-4 py-3">Zimmertyp</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 font-sans italic">
                    Keine Buchungsergebnisse gefunden.
                  </td>
                </tr>
              ) : (
                filteredRegs.map(reg => {
                  const statusColors = {
                    eingegangen: 'bg-blue-100 text-blue-800 border-blue-200',
                    in_bearbeitung: 'bg-amber-100 text-amber-800 border-amber-200',
                    bestaetigt: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    storniert: 'bg-rose-100 text-rose-800 border-rose-200',
                  };

                  return (
                    <tr 
                      key={reg.id} 
                      className="border-b border-brand-gray hover:bg-brand-light-bg/10 transition-colors font-sans"
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-display font-bold text-xs text-brand-dark-brown">{reg.id}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(reg.createdAt).toLocaleDateString('de-DE')}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-brand-dark-text">
                        <div>{reg.vorname} {reg.nachname} <span className="text-[9px] font-normal text-gray-400 font-sans">(Anmelder)</span></div>
                        {reg.isHauptanmelderReisender === false && reg.abweichenderReisenderVorname && (
                          <div className="text-[10px] text-brand-orange font-bold mt-0.5">
                            Reisender Z1: {reg.abweichenderReisenderVorname} {reg.abweichenderReisenderNachname}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-400 font-mono font-normal">{reg.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold">
                        {reg.personenAnzahl}
                        {reg.mitreisende.length > 0 && <span className="block text-[9px] text-gray-400 font-normal">+{reg.mitreisende.length} Begl.</span>}
                      </td>
                      <td className="px-4 py-3.5 text-[11px]">
                        <span className="font-semibold text-brand-blue tracking-tight block">
                          {reg.abflughafen === 'andere Flughäfen' ? reg.abflughafenAnderer : reg.abflughafen}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 text-[11px]">
                        {reg.zimmer && reg.zimmer.length > 0 ? (
                          <div className="space-y-0.5">
                            {reg.zimmer.map((z, idx) => (
                              <div key={idx} className="whitespace-nowrap text-[10px] leading-tight">
                                <span className="font-extrabold text-brand-blue">Z{idx + 1}:</span> {z.gaesteAnzahl}G ({z.zimmertyp || 'N/A'})
                              </div>
                            ))}
                          </div>
                        ) : (
                          reg.zimmertyp
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${statusColors[reg.status]}`}>
                            {reg.status === 'eingegangen' && '📩 Eingegangen'}
                            {reg.status === 'in_bearbeitung' && '⚙️ In Arbeit'}
                            {reg.status === 'bestaetigt' && '☀️ Bestätigt'}
                            {reg.status === 'storniert' && '❌ Storniert'}
                          </span>
                          <select
                            value={reg.status}
                            onChange={(e) => onUpdateStatus(reg.id, e.target.value as Registration['status'])}
                            className="text-[10px] border border-gray-300 rounded mt-1.5 p-0.5 bg-white font-sans text-gray-500"
                          >
                            <option value="eingegangen">Eingegangen</option>
                            <option value="in_bearbeitung">In Arbeit</option>
                            <option value="bestaetigt">Bestätigt</option>
                            <option value="storniert">Storniert</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex gap-1.5">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="bg-gray-100 hover:bg-gray-200 text-brand-dark-brown text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-gray-200"
                          >
                            Details
                          </button>
                          
                          {confirmDeleteId === reg.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onDeleteRegistration(reg.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                              >
                                Ja
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-600 text-[10px] px-2 py-1 rounded cursor-pointer"
                              >
                                Nein
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(reg.id)}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg transition-all cursor-pointer border border-rose-100"
                              title="Buchung löschen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Details */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-gray p-6 font-sans text-xs text-brand-dark-text"
            >
              <div className="flex justify-between items-start border-b border-brand-gray pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase bg-brand-orange/20 text-brand-dark-brown font-bold px-2 py-0.5 rounded">
                      Buchungsakte
                    </span>
                    <span className="text-gray-400 font-mono">ID: {selectedReg.id}</span>
                  </div>
                  <h3 className="text-base font-display font-black text-brand-dark-brown mt-1.5">
                    {selectedReg.anrede} {selectedReg.vorname} {selectedReg.nachname}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedReg(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* 1. Hauptreisender */}
                <div>
                  <h4 className="font-display font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 border-b border-brand-gray pb-1">
                    1. Kundendaten & Kontakt
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-gray-400 block">Geburtsdatum</span>
                      <p className="font-semibold">{new Date(selectedReg.geburtsdatum).toLocaleDateString('de-DE')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 block">E-Mail-Adresse</span>
                      <p className="font-semibold text-brand-blue">{selectedReg.email}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block">Adresse</span>
                      <p className="font-semibold">
                        {selectedReg.strasseHausnummer}, {selectedReg.plz} {selectedReg.ort} ({selectedReg.land})
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Handynummer l. CRS</span>
                      <p className="font-semibold">{selectedReg.telefonMobil}</p>
                    </div>
                    {selectedReg.zimmer && selectedReg.zimmer.length > 1 && (
                      <div>
                        <span className="text-gray-400 block">Zimmer-Zuordnung</span>
                        <p className="font-semibold text-brand-orange">Zimmer {selectedReg.zimmerIndex !== undefined ? selectedReg.zimmerIndex + 1 : 1}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Belegung Zimmer 1 */}
                <div className="bg-brand-blue/5 p-3 rounded-lg border border-brand-blue/10 space-y-1">
                  <h4 className="font-display font-medium text-brand-blue uppercase tracking-wider text-[10px] border-b border-brand-blue/10 pb-1">
                    Belegung Zimmer 1
                  </h4>
                  {selectedReg.isHauptanmelderReisender === false ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase">Reisender Name</span>
                        <p className="font-bold text-brand-orange">
                          {selectedReg.abweichenderReisenderAnrede} {selectedReg.abweichenderReisenderVorname} {selectedReg.abweichenderReisenderNachname}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase">Geburtsdatum</span>
                        <p className="font-semibold">
                          {selectedReg.abweichenderReisenderGeburtsdatum ? new Date(selectedReg.abweichenderReisenderGeburtsdatum).toLocaleDateString('de-DE') : '-'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-brand-dark-brown italic font-sans font-medium">Hauptanmelder reist selbst in Zimmer 1 mit.</p>
                  )}
                </div>

                {/* Firmenrechnung Details */}
                {selectedReg.isFirmenrechnung && (
                  <div className="bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/20 space-y-2">
                    <h4 className="font-display font-bold text-brand-orange uppercase tracking-wider text-[10px] border-b border-brand-orange/20 pb-1">
                      Firmenrechnung gewünscht
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400 block">Firmenname</span>
                        <p className="font-bold text-brand-dark-brown">{selectedReg.firmenName || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Ansprechpartner</span>
                        <p className="font-semibold text-brand-dark-brown">{selectedReg.firmenAnsprechpartner || 'Gleich wie Hauptreisender'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block">Firmenanschrift</span>
                        <p className="font-semibold text-brand-dark-brown">{selectedReg.firmenAnschrift || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Mitreisende */}
                {selectedReg.mitreisende.length > 0 && (
                  <div>
                    <h4 className="font-display font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 border-b border-brand-gray pb-1">
                      2. Companion / Mitreisende ({selectedReg.mitreisende.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedReg.mitreisende.map((mr, idx) => (
                        <div key={idx} className="bg-brand-light-bg p-2.5 rounded-lg border border-brand-gray flex justify-between items-center text-xs">
                          <div className="flex flex-col">
                            <span><strong>{idx + 2}. Person:</strong> {mr.vorname} {mr.nachname}</span>
                            {selectedReg.zimmer && selectedReg.zimmer.length > 1 && (
                              <span className="text-[10px] text-brand-orange font-bold">
                                Zimmer-Zuordnung: Zimmer {mr.zimmerIndex !== undefined ? mr.zimmerIndex + 1 : 1}
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400 italic">Geburtsdatum: {new Date(mr.geburtsdatum).toLocaleDateString('de-DE')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Reisedetails */}
                <div>
                  <h4 className="font-display font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 border-b border-brand-gray pb-1">
                    3. Reisespezifikationen
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="text-gray-400 block">Abflughafen</span>
                      <p className="font-semibold text-brand-dark-brown">
                        {selectedReg.abflughafen === 'andere Flughäfen' ? selectedReg.abflughafenAnderer : selectedReg.abflughafen}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Zuständige Zimmer</span>
                      {selectedReg.zimmer && selectedReg.zimmer.length > 0 ? (
                        <div className="space-y-1.5 mt-1 font-sans">
                          {selectedReg.zimmer.map((z, idx) => {
                            const occupants = [
                              ...(selectedReg.zimmerIndex === idx ? [`${selectedReg.vorname} ${selectedReg.nachname} (Haupt)`] : []),
                              ...selectedReg.mitreisende.filter(m => m.zimmerIndex === idx).map(m => `${m.vorname} ${m.nachname}`)
                            ];
                            return (
                              <div key={idx} className="bg-brand-blue/5 border border-brand-blue/15 rounded p-2 text-[11px] leading-tight space-y-1">
                                <div className="flex justify-between font-semibold">
                                  <span>Zimmer {idx + 1}: {z.zimmertyp || 'N/A'}</span>
                                  <span className="text-gray-500">{z.gaesteAnzahl} {z.gaesteAnzahl === 1 ? 'Person' : 'Personen'}</span>
                                </div>
                                {selectedReg.zimmer.length > 1 && (
                                  <div className="text-[10px] text-brand-orange font-medium">
                                    Gäste: {occupants.join(', ') || 'Keine Angaben'}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-semibold text-brand-dark-brown">{selectedReg.zimmertyp}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Zusatzleistungen */}
                <div>
                  <h4 className="font-display font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 border-b border-brand-gray pb-1">
                    4. Ausgewählte Zusatzleistungen
                  </h4>
                  <div className="bg-brand-light-bg/50 p-3 rounded-lg border border-brand-gray space-y-2">
                    <div className="flex justify-between border-b border-brand-gray/50 pb-1">
                      <span>Urlaub verlängern:</span>
                      <strong className={selectedReg.zusatzVerlaengerung ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzVerlaengerung ? `Ja — ${selectedReg.zusatzVerlaengerungText}` : 'Nein'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-gray/50 pb-1">
                      <span>Sonderhinweise beachten:</span>
                      <strong className={selectedReg.zusatzBeachten ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzBeachten ? `Ja — ${selectedReg.zusatzBeachtenText}` : 'Nein'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-gray/50 pb-1">
                      <span>Besserer Sitzplatz:</span>
                      <strong className={selectedReg.zusatzSitzplatz ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzSitzplatz ? `Ja — ${selectedReg.zusatzSitzplatzText}` : 'Nein'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-gray/50 pb-1">
                      <span>Transfer / Mietwagen:</span>
                      <strong className={selectedReg.zusatzPrivatTransfer ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzPrivatTransfer ? `Ja (${[selectedReg.zusatzTransferAuswahlPrivat && 'Privattransfer', selectedReg.zusatzTransferAuswahlMietwagen && 'Mietwagen'].filter(Boolean).join(' + ')})` : 'Nein'}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-gray/50 pb-1">
                      <span>Angebot Rücktrittsversicherung:</span>
                      <strong className={selectedReg.zusatzVersicherungAngebot ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzVersicherungAngebot ? 'Ja' : 'Nein'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Angebot Rail & Fly:</span>
                      <strong className={selectedReg.zusatzRailAndFly ? 'text-emerald-700' : 'text-gray-500'}>
                        {selectedReg.zusatzRailAndFly ? 'Ja' : 'Nein'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* 5. Gesetzlich & Optionen */}
                <div>
                  <h4 className="font-display font-bold text-brand-blue uppercase tracking-wider text-[10px] mb-2 border-b border-brand-gray pb-1">
                    5. Gesetzliche Bestätigungen & Optionen
                  </h4>
                  <div className="grid grid-cols-2 gap-2 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                    <div>
                      <span className="text-gray-500 block">AGBs zur Kenntnis genommen:</span>
                      <strong className="text-brand-dark-brown">{selectedReg.agbKenntnis}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Pauschalreiserichtlinie beachtet:</span>
                      <strong className="text-brand-dark-brown">{selectedReg.pauschalreiseRichtlinien}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Infos zu Rücktrittsversicherung gewünscht?</span>
                      <strong className="text-brand-dark-brown">{selectedReg.versicherungInfoBenoetigt}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Flexoption (59 Euro):</span>
                      <strong className={selectedReg.flexOption === 'Ja' ? 'text-emerald-700' : 'text-gray-600'}>
                        {selectedReg.flexOption}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Zahlungsart:</span>
                      <strong className="text-brand-blue uppercase font-sans block">
                        {selectedReg.zahlungsart || 'Keine Angabe'}
                      </strong>
                      {selectedReg.zahlungsart === 'Lastschrift' && (
                        <div className="text-[10px] text-gray-600 bg-white p-1 rounded border border-brand-gray mt-1 font-mono">
                          <div>Inh: {selectedReg.zahlungKontoinhaber || '–'}</div>
                          <div>IBAN: {selectedReg.zahlungIban || '–'}</div>
                        </div>
                      )}
                      {selectedReg.zahlungsart === 'Kreditkarte' && (
                        <div className="text-[10px] text-gray-600 bg-white p-1 rounded border border-brand-gray mt-1">
                          <div>Inh: {selectedReg.zahlungKreditkarteInhaber || '–'}</div>
                          <div className="font-mono">CC: {selectedReg.zahlungKreditkarteNummer || '–'}</div>
                          <div>Gültig: {selectedReg.zahlungKreditkarteGueltig || '–'}</div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 pt-1 mt-1 border-t border-brand-gray/40 text-emerald-800 flex items-center gap-1 font-semibold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> DSGVO-Zustimmung liegt vor.
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-brand-gray flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReg(null)}
                  className="bg-brand-orange hover:bg-brand-orange-yellow text-white font-display font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Patientenakte schließen
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
