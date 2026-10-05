sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bestellungenfiori/test/integration/pages/BestellungList.gen",
	"bestellungenfiori/test/integration/pages/BestellungObjectPage.gen"
], function (JourneyRunner, BestellungListGenerated, BestellungObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bestellungenfiori') + '/test/flp.html#app-preview',
        pages: {
			onTheBestellungListGenerated: BestellungListGenerated,
			onTheBestellungObjectPageGenerated: BestellungObjectPageGenerated
        },
        async: true
    });

    return runner;
});

