sap.ui.define([
    "sap/ui/core/UIComponent",
    "motocyclefcl/model/models",
    'sap/ui/model/json/JSONModel',
	'sap/f/library'
], (UIComponent, models, JSONModel, fioriLibrary) => {
    "use strict";

    return UIComponent.extend("motocyclefcl.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            var oModel,
				oProductsModel,
				oRouter;

            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            oModel = new JSONModel();
			this.setModel(oModel);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            oRouter = this.getRouter();
			oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
			oRouter.initialize();
        },
        
        _onBeforeRouteMatched: function(oEvent) {
			var oModel = this.getModel(),
				sLayout = oEvent.getParameters().arguments.layout;

			// If there is no layout parameter, set a default layout (normally OneColumn)
			if (!sLayout) {
				sLayout = fioriLibrary.LayoutType.OneColumn;
			}

			oModel.setProperty("/layout", sLayout);
		}
    });
});