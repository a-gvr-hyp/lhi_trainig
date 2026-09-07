sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("motocyclefcl.controller.Company", {
		onInit: function () {
			var oOwnerComponent = this.getOwnerComponent();

			this.oRouter = oOwnerComponent.getRouter();
			this.oModel = oOwnerComponent.getModel();

			this.oRouter.getRoute("company").attachPatternMatched(this._onPatternMatch, this);
		},

		_onPatternMatch: function (oEvent) {
			this.motocycle = oEvent.getParameter("arguments").motocycle || this.motocycle || "0";
			this.company = oEvent.getParameter("arguments").company || this.company || "0";

			this.getView().bindElement({
				path: "/" + this.company,
				model: "products"
			});
		},

		onExit: function () {
			this.oRouter.getRoute("company").detachPatternMatched(this._onPatternMatch, this);
		}
	});
});
