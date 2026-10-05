using BestellungenService as service from '../../srv/cat-service';
annotate service.Bestellung with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'bestellungs_id',
                Value : bestellungs_id,
            },
            {
                $Type : 'UI.DataField',
                Label : 'bestell_datum',
                Value : bestell_datum,
            },
            {
                $Type : 'UI.DataField',
                Label : 'gesamt_summe',
                Value : gesamt_summe,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'bestellungs_id',
            Value : bestellungs_id,
        },
        {
            $Type : 'UI.DataField',
            Label : 'bestell_datum',
            Value : bestell_datum,
        },
        {
            $Type : 'UI.DataField',
            Label : 'gesamt_summe',
            Value : gesamt_summe,
        },
    ],
);

annotate service.Bestellung with {
    kunde @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Kunde',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : kunde_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'vorname',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'nachname',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'land_code',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'stadt',
            },
        ],
    }
};

