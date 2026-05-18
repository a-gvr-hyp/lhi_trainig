sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("motocyclefreestyle.controller.HelloPanel", {
        param1: "Hello",
        param2: 123,

        onShowHello() {
            // read msg from i18n model
            const oBundle = this.getView().getModel("i18n").getResourceBundle();
            const sRecipient = this.getView().getModel().getProperty("/recipient/name");
            const sMsg = oBundle.getText("helloMsg", [sRecipient]);

            // show message
            MessageToast.show(sMsg);
        },

        async onOpenDialog() {
            this.oDialog ??= await this.loadFragment({
                name: "motocyclefreestyle.view.HelloDialog"
            });

            this.oDialog.open();
        },

		onCloseDialog() {
			// note: We don't need to chain to the pDialog promise, since this event handler
			// is only called from within the loaded dialog itself.
			const dialog = this.byId("helloDialog");
            dialog.close();
		}
    });
});