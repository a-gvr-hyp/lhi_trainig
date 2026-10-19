sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "../model/formatter"
], function (Controller, History, UIComponent, JSONModel, MessageBox, MessageToast, formatter) {
    "use strict";

    const Detail = Controller.extend("motocyclesmartelements.controller.Detail", {

        formatter: formatter,

        onInit() {
            const router = UIComponent.getRouterFor(this);
            router.getRoute("Detail").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(event) {
            const motocycleId = event.getParameter("arguments").motocycleId;
            const oModel = this.getOwnerComponent().getModel();
            oModel.read("/Motocycle(guid'" + motocycleId + "')", {
                success: (oData) => {
                    const oDetailModel = new JSONModel(oData);
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
        },

        onDelete() {
            MessageBox.warning("Are you sure you want to delete this motocycle?", {
                actions: ["Yes", MessageBox.Action.CLOSE],
                emphasizedAction: "Yes",
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        const oModel = this.getOwnerComponent().getModel();
                        const motocycleId = this.getView().getModel("detailModel").getProperty("/ID");
                        oModel.remove("/Motocycle(guid'" + motocycleId + "')", {
                            success: () => {
                                MessageToast.show("Motocycle deleted successfully");
                                this.onNavBack();
                            },
                            error: (oError) => {
                                console.error("Error deleting motocycle", oError);
                                MessageToast.show("Error deleting motocycle");
                            }
                        });
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },

        onEdit() {
            const motocycleId = this.getView().getModel("detailModel").getProperty("/ID");
            const router = UIComponent.getRouterFor(this);
            router.navTo("Update", { motocycleId: motocycleId });
        }
    });
    return Detail;
});