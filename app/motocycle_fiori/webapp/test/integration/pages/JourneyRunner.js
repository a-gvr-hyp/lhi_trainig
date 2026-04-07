sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"motocyclefiori/test/integration/pages/MotocycleList",
	"motocyclefiori/test/integration/pages/MotocycleObjectPage"
], function (JourneyRunner, MotocycleList, MotocycleObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('motocyclefiori') + '/test/flp.html#app-preview',
        pages: {
			onTheMotocycleList: MotocycleList,
			onTheMotocycleObjectPage: MotocycleObjectPage
        },
        async: true
    });

    return runner;
});

