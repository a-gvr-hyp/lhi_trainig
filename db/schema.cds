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
  bestell_datum: String;
  gesamt_summe: Decimal;
  kunde : Association to Kunden;
}
