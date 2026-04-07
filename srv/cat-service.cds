using db from '../db/schema';

service MotocycleService {
    entity Company as projection on db.Company;
    entity Motocycle as projection on db.Motocycle;
}
