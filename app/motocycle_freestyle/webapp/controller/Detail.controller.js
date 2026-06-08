sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    const Detail = Controller.extend("motocyclefreestyle.controller.Detail", {

        onInit() {
            const router = UIComponent.getRouterFor(this);
            router.getRoute("Detail").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(event) {
            const motocycleId = event.getParameter("arguments").motocycleId;
            const oModel = this.getOwnerComponent().getModel("modelV2");
            oModel.read("/Motocycle(guid'" + motocycleId + "')", {
                success: (oData) => {
                    const oDetailModel = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oDetailModel, "detailModel");
                },
                error: (oError) => {
                    console.error("Error fetching motocycle data", oError);
                }
            });
        },

        onNavBack() {
            const history = History.getInstance();
            const previousHash = history.getPreviousHash();
            if (previousHash !== undefined) {
                window.history.go(-1);
            } else {
                const router = UIComponent.getRouterFor(this);
                router.navTo("RouteApp", {}, true);
            }
        }
    });
    return Detail;
});