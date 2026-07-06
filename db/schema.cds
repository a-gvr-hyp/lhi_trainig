namespace db;

using {
  managed,
  cuid,
  Country
} from '@sap/cds/common';

aspect primary : cuid {}

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
