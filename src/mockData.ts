import { Registration } from './types';

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-2026-001',
    createdAt: '2026-06-18T14:22:10.000Z',
    status: 'bestaetigt',
    anrede: 'Herr',
    vorname: 'Michael',
    nachname: 'Huber',
    geburtsdatum: '1968-04-12',
    strasseHausnummer: 'Schillerstraße 45',
    plz: '80336',
    ort: 'München',
    land: 'Deutschland',
    telefonMobil: '0172 9876543',
    email: 'm.huber@web.de',
    personenAnzahl: 2,
    mitreisende: [
      {
        vorname: 'Brigitte',
        nachname: 'Huber',
        geburtsdatum: '1970-08-15'
      }
    ],
    abflughafen: 'München (MUC)',
    zimmertyp: 'Doppelzimmer mit Meerblick',
    agbKenntnis: 'Ja',
    pauschalreiseRichtlinien: 'Ja',
    versicherungInfoBenoetigt: 'Nein',
    flexOption: 'Ja',
    dsgvoEinverstaendnis: true,
    zusatzVerlaengerung: true,
    zusatzVerlaengerungText: 'Gerne um 3 Tage verlängern vom 15.11. bis 18.11.2026',
    zusatzBeachten: false,
    zusatzBeachtenText: '',
    zusatzSitzplatz: true,
    zusatzSitzplatzText: 'Zwei Plätze nebeneinander am Fenster in Reihe 10-15',
    zusatzPrivatTransfer: true,
    zusatzVersicherungAngebot: false,
    zusatzRailAndFly: true
  },
  {
    id: 'REG-2026-002',
    createdAt: '2026-06-19T09:12:44.000Z',
    status: 'eingegangen',
    anrede: 'Frau',
    vorname: 'Monika',
    nachname: 'Sander',
    geburtsdatum: '1959-11-23',
    strasseHausnummer: 'Kastanienallee 8',
    plz: '10435',
    ort: 'Berlin',
    land: 'Deutschland',
    telefonMobil: '0151 4455667',
    email: 'monika.sander@it-services.de',
    personenAnzahl: 1,
    mitreisende: [],
    abflughafen: 'Berlin (BER)',
    zimmertyp: 'Einzelzimmer mit Meerblick',
    agbKenntnis: 'Ja',
    pauschalreiseRichtlinien: 'Ja',
    versicherungInfoBenoetigt: 'Ja',
    flexOption: 'Nein',
    dsgvoEinverstaendnis: true,
    zusatzVerlaengerung: false,
    zusatzVerlaengerungText: '',
    zusatzBeachten: true,
    zusatzBeachtenText: 'Bitte vegetarisches Essen auf dem Flug',
    zusatzSitzplatz: false,
    zusatzSitzplatzText: '',
    zusatzPrivatTransfer: false,
    zusatzVersicherungAngebot: true,
    zusatzRailAndFly: false
  }
];

export const DEPARTURE_AIRPORTS = [
  'Düsseldorf (DUS)',
  'Frankfurt (FRA)',
  'München (MUC)',
  'Hamburg (HAM)',
  'Berlin (BER)',
  'Stuttgart (STR)',
  'Köln/Bonn (CGN)',
  'Hannover (HAJ)',
  'Leipzig/Halle (LEJ)',
  'Nürnberg (NUE)',
  'Anderer Abflughafen (bitte angeben)'
];

export const ROOM_TYPES = [
  'Einzelzimmer ohne Meerblick',
  'Einzelzimmer mit Meerblick',
  'Doppelzimmer ohne Meerblick',
  'Doppelzimmer mit Meerblick',
  'Atlantiksuite',
  'Juniorsuite',
  'Familienzimmer'
];
