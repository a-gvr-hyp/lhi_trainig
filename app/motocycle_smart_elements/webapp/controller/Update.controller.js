sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Messaging",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, History, UIComponent, Messaging, JSONModel, MessageBox, MessageToast) {
    "use strict";

    // Only these fields are sent to the server. ID, discount, hasDiscount and discountPrice
    // are read-only: discount/hasDiscount are set by the service handler (jahr < 2020),
    // discountPrice is a calculated element.
    const EDITABLE_FIELDS = [
        "name", "typ", "company_ID", "farbe", "jahr", "preis",
        "motorbauart", "zylinder", "hubraum", "leistung_ps", "leistung_kw", "drehmoment_nm",
        "kuehlung", "getriebe_gaenge", "antrieb",
        "gewicht_kg", "tankinhalt_l", "sitzhoehe_mm", "hoechstgeschwindigkeit_kmh",
        "fuehrerscheinklasse", "beschreibung", "quelle_url"
    ];

    // marked as required in the view; name, typ and hubraum are also @mandatory on the server
    const REQUIRED_FIELDS = ["name", "typ", "company_ID", "jahr", "preis", "hubraum"];

    const Update = Controller.extend("motocyclesmartelements.controller.Update", {

        onInit() {
            // collect type validation errors of the inputs (handleValidation is enabled in index.html)
            Messaging.registerObject(this.getView(), true);
            const router = UIComponent.getRouterFor(this);
            router.getRoute("Update").attachPatternMatched(this.onObjectMatched, this);
        },

        onObjectMatched(event) {
            Messaging.removeAllMessages();
            const motocycleId = event.getParameter("arguments").motocycleId;
            const oModel = this.getOwnerComponent().getModel();
            oModel.read("/Motocycle(guid'" + motocycleId + "')", {
                success: (oData) => {
                    const oUpdateModel = new JSONModel(oData);
                    this.getView().setModel(oUpdateModel, "updateModel");
                },
                error: (oError) => {
                    MessageBox.error(this._getErrorMessage(oError));
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

        onUpdate() {
            // only input validation errors (attached to a control); server errors of earlier saves don't block
            const hasErrors = Messaging.getMessageModel().getData()
                .some((oMessage) => oMessage.getType() === "Error" && oMessage.getControlIds().length > 0);
            if (hasErrors) {
                MessageBox.error(this._getText("validationErrorText"));
                return;
            }
            const oData = this.getView().getModel("updateModel").getData();
            if (REQUIRED_FIELDS.some((sField) => oData[sField] === null || oData[sField] === undefined || oData[sField] === "")) {
                MessageBox.error(this._getText("requiredFieldsText"));
                return;
            }
            MessageBox.warning(this._getText("updateConfirmText"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.CLOSE],
                emphasizedAction: MessageBox.Action.YES,
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        this._save();
                    }
                }.bind(this),
                dependentOn: this.getView()
            });
        },

        _save() {
            const oData = this.getView().getModel("updateModel").getData();
            const oPayload = {};
            EDITABLE_FIELDS.forEach((sField) => {
                // empty inputs/selects are stored as null, not as empty string
                oPayload[sField] = oData[sField] === "" || oData[sField] === undefined ? null : oData[sField];
            });
            const oModel = this.getOwnerComponent().getModel();
            oModel.update("/Motocycle(guid'" + oData.ID + "')", oPayload, {
                success: () => {
                    MessageToast.show(this._getText("updateSuccessText"));
                    this.onNavBack();
                },
                error: (oError) => {
                    MessageBox.error(this._getErrorMessage(oError));
                }
            });
        },

        // CAP returns validation errors (e.g. @assert.range) as OData error message
        _getErrorMessage(oError) {
            try {
                return JSON.parse(oError.responseText).error.message.value;
            } catch (e) {
                return this._getText("updateErrorText");
            }
        },

        _getText(sKey) {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sKey);
        }
    });
    return Update;
});
