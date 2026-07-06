sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
], function (Controller, History, UIComponent, MessageBox) {
    "use strict";

    const Update = Controller.extend("motocyclefreestyle.controller.Update", {

        onInit() {
            const router = UIComponent.getRouterFor(this);
            router.getRoute("Update").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(event) {
            const motocycleId = event.getParameter("arguments").motocycleId;
            const oModel = this.getOwnerComponent().getModel("modelV2");
            oModel.read("/Motocycle(guid'" + motocycleId + "')", {
                success: (oData) => {
                    const oUpdateModel = new sap.ui.model.json.JSONModel(oData);
                    this.getView().setModel(oUpdateModel, "updateModel");
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

        onUpdate() {
            MessageBox.warning("Are you sure you want to update this motocycle?", {
                actions: ["Yes", MessageBox.Action.CLOSE],
                emphasizedAction: "Yes",
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        const oModel = this.getOwnerComponent().getModel("modelV2");
                        const motocycleId = this.getView().getModel("updateModel").getProperty("/ID");
                        oModel.update("/Motocycle(guid'" + motocycleId + "')", this.getView().getModel("updateModel").getData(), {
                            success: () => {
                                sap.m.MessageToast.show("Motocycle updated successfully");
                                this.getMotocycle();
                                this.onNavBack();
                            },
                            error: (oError) => {
                                console.error("Error updating motocycle", oError);
                                sap.m.MessageToast.show("Error updating motocycle");
                            }
                        });
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        }
    });
    return Update;
});