using db from '../db/schema';

service MotocycleService {
    entity Company as projection on db.Company;
    entity Motocycle as projection on db.Motocycle;
    function hello() returns String; //internal
    action helloAction() returns String; //external

    function getMotocyclesByCompany(companyId: String) returns array of Motocycle;
    action getMotocyclesByCompanyAction(companyId: String) returns array of Motocycle;
}


service BestellungenService {
    entity Kunde as projection on db.Kunden;
    entity Bestellung as projection on db.Bestellungen;
}

// Input validation for Motocycle (https://cap.cloud.sap/docs/guides/services/constraints)
annotate MotocycleService.Motocycle with {
    name                       @mandatory;
    typ                        @mandatory;
    hubraum                    @mandatory;
    discount                   @readonly; // set by the before CREATE/UPDATE handler (jahr < 2020)
    hasDiscount                @readonly;
    hubraum                    @assert.range: [50, 3000];
    jahr                       @assert.range: [1900, 2100];
    preis                      @assert.range: [0, 9999999.99];
    leistung_ps                @assert.range: [1, 400];
    leistung_kw                @assert.range: [1, 300];
    drehmoment_nm              @assert.range: [1, 400];
    zylinder                   @assert.range: [1, 8];
    getriebe_gaenge            @assert.range: [1, 8];
    gewicht_kg                 @assert.range: [50, 600];
    tankinhalt_l               @assert.range: [1, 60];
    sitzhoehe_mm               @assert.range: [500, 1100];
    hoechstgeschwindigkeit_kmh @assert.range: [50, 400];
    quelle_url                 @assert.format: '^https?://';
};
