namespace db;

using {
  managed,
  cuid,
  Country
} from '@sap/cds/common';

aspect primary : cuid {}

entity Kunden : primary {
  vorname : String;
  nachname : String;
  land : Country;
  stadt : String;
}

entity Bestellungen : primary {
  bestellungs_id: Int32;
  bestell_datum: Date;
  gesamt_summe: Decimal(9,2);
  kunde : Association to Kunden;
}



entity Company : primary {
  name : String;
  land : Country;
}

entity Motocycle : primary {
  name    : String;
  typ     : String;
  hubraum : Integer;
  farbe   : String;
  jahr : Integer;
  preis : Decimal(9,2);
  discount: Integer default 0;
  hasDiscount: Boolean default false;
  company : Association to Company;
  // technische Daten
  leistung_ps : Integer;            // Leistung in PS
  leistung_kw : Integer;            // Leistung in kW
  drehmoment_nm : Integer;          // max. Drehmoment in Nm
  zylinder : Integer;               // Anzahl Zylinder
  motorbauart : String(50);         // z.B. Boxer, Reihe, V, Parallel-Twin
  kuehlung : String(30);            // Wasser, Luft/Öl, Luft
  getriebe_gaenge : Integer;
  antrieb : String(20);             // Kette, Kardan, Riemen
  gewicht_kg : Integer;             // fahrbereit / vollgetankt
  tankinhalt_l : Decimal(4,1);
  sitzhoehe_mm : Integer;           // Standard-Sitzhöhe
  hoechstgeschwindigkeit_kmh : Integer;
  fuehrerscheinklasse : String(5);  // A, A2 oder A1
  beschreibung : String(500);       // kurze deutsche Beschreibung, 1–2 Sätze
  quelle_url : String(500);         // Hauptquelle der Daten
  // calculated on read by the database – works with $select, $filter and $orderby
  discountPrice : Decimal(9,2) = case when hasDiscount = true
                                      then preis * (100 - discount) / 100.0
                                      else preis end;
}
