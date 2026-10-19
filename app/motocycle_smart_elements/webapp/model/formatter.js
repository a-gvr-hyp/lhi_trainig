sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
    "use strict";

    const EMPTY = "–";
    const oNumberFormat = NumberFormat.getFloatInstance({ maxFractionDigits: 1 });

    const isEmpty = (vValue) => vValue === null || vValue === undefined || vValue === "";

    return {
        /**
         * Returns the text or a dash if no value is maintained.
         * @param {string} sValue text value
         * @returns {string} the text or "–"
         */
        text(sValue) {
            return isEmpty(sValue) ? EMPTY : sValue;
        },

        /**
         * Formats a number locale-dependent and appends its unit, e.g. "1.254 ccm".
         * OData V2 returns Edm.Decimal as string – NumberFormat handles both.
         * @param {number|string} vValue numeric value
         * @param {string} sUnit unit text
         * @returns {string} formatted value with unit or "–"
         */
        withUnit(vValue, sUnit) {
            return isEmpty(vValue) ? EMPTY : oNumberFormat.format(vValue) + " " + sUnit;
        },

        /**
         * Formats the engine power as "136 PS / 100 kW".
         * @param {number} iPs power in PS
         * @param {number} iKw power in kW
         * @returns {string} formatted power or "–"
         */
        power(iPs, iKw) {
            if (isEmpty(iPs) && isEmpty(iKw)) {
                return EMPTY;
            }
            return [isEmpty(iPs) ? null : iPs + " PS", isEmpty(iKw) ? null : iKw + " kW"]
                .filter(Boolean)
                .join(" / ");
        }
    };
});
