sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
], function (Controller, History, UIComponent, MessageBox) {
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
        },

        onDelete() {
            MessageBox.warning("Are you sure you want to delete this motocycle?", {
                actions: ["Yes", MessageBox.Action.CLOSE],
                emphasizedAction: "Yes",
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        const oModel = this.getOwnerComponent().getModel("modelV2");
                        const motocycleId = this.getView().getModel("detailModel").getProperty("/ID");
                        oModel.remove("/Motocycle(guid'" + motocycleId + "')", {
                            success: () => {
                                sap.m.MessageToast.show("Motocycle deleted successfully");
                                this.getMotocycle();
                                this.onNavBack();
                            },
                            error: (oError) => {
                                console.error("Error deleting motocycle", oError);
                                sap.m.MessageToast.show("Error deleting motocycle");
                            }
                        });
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },

        getMotocycle() {
			const oModel = this.getOwnerComponent().getModel("modelV2");
			oModel.read("/Motocycle", {
				success: (oData) => {
					const oMotocycleModel = this.getOwnerComponent().getModel("motocycleModel");
					oMotocycleModel.setProperty("/Motocycle", oData.results);
					oMotocycleModel.setProperty("/ADVMotocycle", oData.results.filter((moto) => moto.typ === "ADV"));
				},
				error: (oError) => {
					console.error("Error fetching motocycle data", oError);
				}
			});
		},
    });
    return Detail;
});