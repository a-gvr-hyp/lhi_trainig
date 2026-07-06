using db from '../db/schema';

service MotocycleService {
    entity Company as projection on db.Company;
    entity Motocycle as projection on db.Motocycle;
    function hello() returns String; //internal
    action helloAction() returns String; //external

    function getMotocyclesByCompany(companyId: String) returns array of String;
    action getMotocyclesByCompanyAction(companyId: String) returns array of String;
}
