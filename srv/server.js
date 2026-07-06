const cds = require("@sap/cds");
const xsenv = require("@sap/xsenv");
xsenv.loadEnv();
cds.on('bootstrap', (app) => {
    //bleibt standard
});
module.exports = cds.server;