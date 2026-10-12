const cds = require("@sap/cds");
// CAP loads default-env.json itself (cds.env), so @sap/xsenv is not needed
cds.on('bootstrap', (app) => {
    //bleibt standard
});
module.exports = cds.server;
