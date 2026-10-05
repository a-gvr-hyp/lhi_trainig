sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("motocyclefcl.controller.Company", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();

			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();

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

		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/fullScreen");
			this.oRouter.navTo("company", {layout: sNextLayout, motocycle: this.motocycle, company: this.company});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/exitFullScreen");
			this.oRouter.navTo("company", {layout: sNextLayout, motocycle: this.motocycle, company: this.company});
		},

		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/endColumn/closeColumn");
			this.oRouter.navTo("detail", {layout: sNextLayout, motocycle: this.motocycle});
		},

		onExit: function () {
			this.oRouter.getRoute("company").detachPatternMatched(this._onPatternMatch, this);
		}
	});
});
