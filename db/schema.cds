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
  virtual discountPrice: Decimal(9,2) @readonly;
}
