sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function (Controller, History, UIComponent) {
    "use strict";

    const Create = Controller.extend("motocyclefreestyle.controller.Create", {

        onInit() {
            const router = UIComponent.getRouterFor(this);
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

        onSave() {
            const oCreateModel = this.getView().getModel("createMotocycleModel");
            const oNewMotocycle = oCreateModel.getData();
            const oNewMotocycleData = {
                name: oNewMotocycle.name,
                typ: oNewMotocycle.typ,
                hubraum: oNewMotocycle.hubraum,
                farbe: oNewMotocycle.farbe,
                company_ID: this.getView().byId("iCompanyID").getSelectedKey()
            }
			const oModel = this.getOwnerComponent().getModel("modelV2");
			oModel.create("/Motocycle", oNewMotocycleData, {
				success: () => {
					sap.m.MessageToast.show("Motocycle added successfully");
                    this.getMotocycle();
                    this.onNavBack();
				},
				error: (oError) => {
					console.error("Error fetching motocycle data", oError);
				}
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

        onValueHelpRequest(oEvent) {
			var sInputValue = oEvent.getSource().getValue(),
				oView = this.getView();

			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "motocyclefreestyle.fragment.ValueHelpDialog",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._pValueHelpDialog.then(function(oDialog) {
				// Create a filter for the binding
				oDialog.getBinding("items").filter([new Filter("Name", FilterOperator.Contains, sInputValue)]);
				// Open ValueHelpDialog filtered by the input's value
				oDialog.open(sInputValue);
			});
		},
    });
    return Create;
});