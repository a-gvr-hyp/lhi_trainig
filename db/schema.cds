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
  company : Association to Company;
}
