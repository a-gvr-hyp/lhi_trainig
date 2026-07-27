sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox"
], (Controller, UIComponent, MessageBox) => {
    "use strict";

    return Controller.extend("motocyclesmartelements.controller.List", {
        onInit() {
            const oViewModel = this.getOwnerComponent().getModel("viewModel");
            oViewModel.setData({
                isDeleteEnabled: false
            })
        },

        onListItemPress(event) {
            const item = event.getSource();
            const router = UIComponent.getRouterFor(this);
            router.navTo("Detail", {
                motocycleId: item.getBindingContext().getObject().ID
            });
        },

        onTableSelectionChange(event) {
            const oViewModel = this.getOwnerComponent().getModel("viewModel");
            const oTable = this.getView().byId("itMotocycle");
            if (oTable.getSelectedItems().length) {
                oViewModel.setData({
                    isDeleteEnabled: true
                })
            } else {
                oViewModel.setData({
                    isDeleteEnabled: false
                })
            }
        },

        onDeleteMultipleItems(event) {
            MessageBox.warning("Are you sure you want to delete all the selected motocycle?", {
                actions: ["Yes", MessageBox.Action.CLOSE],
                emphasizedAction: "Yes",
                onClose: function (sAction) {
                    if (sAction === "Yes") {
                        const oModel = this.getOwnerComponent().getModel();
                        const oTable = this.getView().byId("itMotocycle");
                        const aItems = oTable.getSelectedItems();
                        for (let i = 0; i < aItems.length; i++) {
                            let oItem = aItems[i];
                            let sID = oItem.getBindingContext().getObject().ID
                            oModel.remove("/Motocycle(guid'" + sID + "')", {
                                success: () => {
                                    sap.m.MessageToast.show("Motocycle deleted successfully");
                                },
                                error: (oError) => {
                                    console.error("Error deleting motocycle", oError);
                                    sap.m.MessageToast.show("Error deleting motocycle");
                                }
                            });
                        }
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },

        onCreate(event){
            const router = UIComponent.getRouterFor(this);
			router.navTo("Create");
        }
    });
});