sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], (Controller, JSONModel, Filter, FilterOperator) => {
	"use strict";

	return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
		onInit() {
			const oViewModel = new JSONModel({
				currency: "EUR"
			});
			this.getView().setModel(oViewModel, "view");
			this.getMotocycle();
		},

		statusText(sStatus) {
			const oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "A":
					return oResourceBundle.getText("invoiceStatusA");
				case "B":
					return oResourceBundle.getText("invoiceStatusB");
				case "C":
					return oResourceBundle.getText("invoiceStatusC");
				default:
					return sStatus;
			}
		},

		onFilterInvoices(oEvent) {
			// build filter array
			const aFilter = [];
			const sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}

			// filter binding
			const oList = this.byId("invoiceList");
			const oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
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

		onAddMotocycle() {
			const oNewMotocycle = {
				company_ID: "62537d2e-f45e-4815-b5e1-243a1b3c042a",
				farbe: "Blau",
				hubraum: 800,
				name: "GSA-800",
				typ: "ADV"
			};
			const oModel = this.getOwnerComponent().getModel("modelV2");
			oModel.create("/Motocycle", oNewMotocycle, {
				success: (oData) => {
					this.getMotocycle();
					sap.m.MessageToast.show("Motocycle added successfully");
				},
				error: (oError) => {
					console.error("Error fetching motocycle data", oError);
				}
			});
		}

	});
});