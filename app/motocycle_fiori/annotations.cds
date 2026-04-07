using MotocycleService as service from '../../srv/cat-service';
annotate service.Motocycle with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'name',
                Value : name,
            },
            {
                $Type : 'UI.DataField',
                Label : 'typ',
                Value : typ,
            },
            {
                $Type : 'UI.DataField',
                Label : 'hubraum',
                Value : hubraum,
            },
            {
                $Type : 'UI.DataField',
                Label : 'farbe',
                Value : farbe,
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
            Label : 'name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'typ',
            Value : typ,
        },
        {
            $Type : 'UI.DataField',
            Label : 'hubraum',
            Value : hubraum,
        },
        {
            $Type : 'UI.DataField',
            Label : 'farbe',
            Value : farbe,
        },
    ],
);

annotate service.Motocycle with {
    company @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Company',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : company_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'land_code',
            },
        ],
    }
};

