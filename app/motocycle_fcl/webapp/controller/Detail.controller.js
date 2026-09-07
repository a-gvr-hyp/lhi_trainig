sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/f/library'
], function (Controller, fioriLibrary) {
	"use strict";

	return Controller.extend("motocyclefcl.controller.Detail", {
        onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("list").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("company").attachPatternMatched(this._onProductMatched, this);
		},

        _onProductMatched: function (oEvent) {
			this.motocycle = oEvent.getParameter("arguments").motocycle || this.motocycle || "0";
			this.getView().bindElement({
				path: "/" + this.motocycle,
				model: "products"
			});
		},
		
		onSupplierPress: function (oEvent) {
			var supplierPath = oEvent.getSource().getBindingContext("products").getPath(),
				company = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("company", {layout: fioriLibrary.LayoutType.ThreeColumnsMidExpanded, company: company, motocycle: this.motocycle});
		},

		onEditToggleButtonPress: function() {
			var oObjectPage = this.getView().byId("ObjectPageLayout"),
				bCurrentShowFooterState = oObjectPage.getShowFooter();

			oObjectPage.setShowFooter(!bCurrentShowFooterState);
		},

		onExit: function () {
			this.oRouter.getRoute("list").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});