const cds = require("@sap/cds");
module.exports = (srv) => {

  srv.before("CREATE", "Motocycle", async (req) => {
    var oData = req.data;
    const dMotocicleDate = new Date(oData.jahr, 0, 1);
    if (dMotocicleDate < new Date(2020, 0, 1)) {
      oData.discount = 10;
      oData.hasDiscount = true;
    }
    req.data = oData;
  });

  srv.after("READ", "Motocycle", async (req) => {
    var aData = req;
    for (let i = 0; i < aData.length; i++) {
      var oData = aData[i];
      if (oData.hasDiscount) {
        oData.discountPrice = oData.preis - (oData.preis * oData.discount / 100);
        aData[i] = oData;
      } else {
        oData.discountPrice = oData.preis;
        aData[i] = oData;
      }
    }    
  });

  srv.on("hello", async (req) => {
    return "Hello, World!";
  });

  srv.on("getMotocyclesByCompany", async (req) => {
    return await getMotocyclesByCompany(req.data.companyId);
  });

  //implementation for External Use
  srv.on("getMotocyclesByCompanyAction", async (req) => {
    return await getMotocyclesByCompany(req.data.companyId);
    
  });

  async function getMotocyclesByCompany(companyId) {
    const db = await cds.connect.to("db");
    const result = await db.run(
      SELECT.from("db.Motocycle").where({ company_ID: companyId })
    );
    return result;
  }
}