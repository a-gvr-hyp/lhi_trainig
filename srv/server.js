const cds = require("@sap/cds");
// CAP loads default-env.json itself (cds.env), so @sap/xsenv is not needed
// prepend: has to run before the OData V2 adapter's middleware
cds.prependListener('bootstrap', (app) => {
    // The apps use relative service URLs (<app>/odata/...). On BTP the approuter routes them
    // to the service (xs-app.json); locally this does the same for cds watch.
    if (cds.env.production) return;
    app.use((req, res, next) => {
        req.url = req.url.replace(/^\/[^/]+\/(odata\/)/, '/$1');
        next();
    });
});
module.exports = cds.server;
