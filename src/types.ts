export interface Reisender {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  zimmerIndex?: number;
}

export interface ZimmerBuchung {
  gaesteAnzahl: number;
  zimmertyp: 'Einzelzimmer ohne Meerblick' | 'Einzelzimmer mit Meerblick' | 'Doppelzimmer ohne Meerblick' | 'Doppelzimmer mit Meerblick' | 'Atlantiksuite' | 'Juniorsuite' | 'Familienzimmer' | '';
}

export interface Registration {
  id: string;
  createdAt: string;
  status: 'eingegangen' | 'in_bearbeitung' | 'bestaetigt' | 'storniert';
  
  // Anmelder / Hauptreisender
  anrede: 'Herr' | 'Frau' | 'Divers' | '';
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  strasseHausnummer: string;
  plz: string;
  ort: string;
  land: string;
  telefonMobil: string;
  email: string;
  zimmerIndex?: number;

  // Firmenrechnung Option
  isFirmenrechnung?: boolean;
  firmenName?: string;
  firmenAnschrift?: string;
  firmenAnsprechpartner?: string;

  // Abweichender Reisende für Zimmer 1 (falls Anmelder nicht selbst reist)
  isHauptanmelderReisender?: boolean;
  abweichenderReisenderAnrede?: string;
  abweichenderReisenderVorname?: string;
  abweichenderReisenderNachname?: string;
  abweichenderReisenderGeburtsdatum?: string;
  
  // Anzahl Personen & Mitreisende
  personenAnzahl: number;
  mitreisende: Reisender[];
  
  // Zimmer Logik (Max 4 Zimmer)
  zimmer?: ZimmerBuchung[];
  
  // Flug & Abflughafen
  abflughafen: string;
  abflughafenAnderer?: string;
  
  // Zimmertyp
  zimmertyp: 'Einzelzimmer ohne Meerblick' | 'Einzelzimmer mit Meerblick' | 'Doppelzimmer ohne Meerblick' | 'Doppelzimmer mit Meerblick' | 'Atlantiksuite' | 'Juniorsuite' | 'Familienzimmer' | '';
  
  // Wichtige Angaben (Ja / Nein)
  agbKenntnis: 'Ja' | 'Nein' | '';
  pauschalreiseRichtlinien: 'Ja' | 'Nein' | '';
  versicherungInfoBenoetigt: 'Ja' | 'Nein' | '';
  flexOption: 'Ja' | 'Nein' | '';
  zahlungsart: 'Lastschrift' | 'Überweisung' | 'Kreditkarte' | '';
  zahlungIban?: string;
  zahlungKontoinhaber?: string;
  zahlungKreditkarteNummer?: string;
  zahlungKreditkarteGueltig?: string;
  zahlungKreditkarteInhaber?: string;
  dsgvoEinverstaendnis: boolean;
  
  // Zusatzleistungen (Absenden und Zusatzleistungen)
  zusatzVerlaengerung: boolean;
  zusatzVerlaengerungText: string;
  zusatzBeachten: boolean;
  zusatzBeachtenText: string;
  zusatzSitzplatz: boolean;
  zusatzSitzplatzText: string;
  zusatzPrivatTransfer: boolean;
  zusatzTransferAuswahlPrivat?: boolean;
  zusatzTransferAuswahlMietwagen?: boolean;
  zusatzVersicherungAngebot: boolean;
  zusatzRailAndFly: boolean;
}
