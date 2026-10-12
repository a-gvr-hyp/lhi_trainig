const cds = require("@sap/cds");

class MotocycleService extends cds.ApplicationService {
  init() {
    const { Motocycle } = this.entities;

    // Motorcycles built before 2020 get a 10 % discount
    this.before(["CREATE", "UPDATE"], Motocycle, (req) => {
      const { jahr } = req.data;
      if (jahr != null && jahr < 2020) {
        req.data.discount = 10;
        req.data.hasDiscount = true;
      }
    });

    this.on("hello", () => "Hello, World!"); //internal
    this.on("helloAction", () => "Hello, World!"); //external

    // this.read() runs the query through this service, incl. its READ handlers
    this.on(["getMotocyclesByCompany", "getMotocyclesByCompanyAction"], (req) =>
      this.read(Motocycle).where({ company_ID: req.data.companyId })
    );

    return super.init();
  }
}

// Services without an entry here (BestellungenService) use the generic default implementation
module.exports = { MotocycleService };
