export interface Reisender {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  zimmerIndex?: number;
}

export interface ZimmerBuchung {
  gaesteAnzahl: number;
  zimmertyp: 'Einzelzimmer ohne Meerblick' | 'Einzelzimmer mit Meerblick' | 'Doppelzimmer ohne Meerblick' | 'Doppelzimmer mit Meerblick' | 'Atlantiksuite' | 'Atlantik Suite mit Meerblick' | 'Atlantiksuite mit Meerblick' | 'Juniorsuite' | 'Familienzimmer' | 'Familienzimmer mit Meerblick' | '';
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
  zimmertyp: 'Einzelzimmer ohne Meerblick' | 'Einzelzimmer mit Meerblick' | 'Doppelzimmer ohne Meerblick' | 'Doppelzimmer mit Meerblick' | 'Atlantiksuite' | 'Atlantik Suite mit Meerblick' | 'Atlantiksuite mit Meerblick' | 'Juniorsuite' | 'Familienzimmer' | 'Familienzimmer mit Meerblick' | '';
  
  // Wichtige Angaben (Ja / Nein)
  agbKenntnis: 'Ja' | 'Nein' | '';
  pauschalreiseRichtlinien: 'Ja' | 'Nein' | '';
  versicherungInfoBenoetigt: 'Ja' | 'Nein' | '';
  flexOption: 'Ja' | 'Nein' | '';
  zahlungsart: 'Lastschrift' | 'Überweisung' | 'Kreditkarte' | '';
  zahlungLastschriftDatenEingeben?: 'online' | 'telefonisch' | '';
  zahlungIban?: string;
  zahlungKontoinhaber?: string;
  // PCI-DSS: Kreditkartendaten werden niemals über Formular/Webhook/E-Mail übertragen, sondern telefonisch oder per zertifiziertem Zahlungslink abgewickelt
  zahlungKreditkarteHinweisTelefon?: boolean;
  dsgvoEinverstaendnis: boolean; // Kenntnisnahme zur Datenverarbeitung & Vertragserfüllung gem. Art. 6 Abs. 1 lit. b DSGVO
  dsgvoDrittdatenEinverstaendnis?: boolean;
  
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
  isAnonymized?: boolean;
}
