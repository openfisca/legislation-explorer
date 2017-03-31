description: "Navigating to an interrupted parameter should say it doesn't exist anymore, and show its former values",

steps: [
  SearchBarComponent.searchFor(bouclierFiscalQuery),
  AppComponent.goToFirstResult(),
  {
    "DetailsComponent.description": bouclierFiscalDescription,
    "ParameterTableComponent.firstLineCaption": interruptionMessage,
    "ParameterTableComponent.secondLineCaption": dateRange,
    "ParameterTableComponent.secondLineValue": floatValue,
  },
  DetailsComponent.goBack(),
]
