description: "Navigating to an interrupted parameter should say it doesn't exist anymore, and show its former values",

steps: [
  SearchBarComponent.searchFor(bouclierFiscalQuery),
  AppComponent.goToFirstResult(),
  {
    "ParameterComponent.description": bouclierFiscalDescription,
    "ParameterTableComponent.firstLineCaption": interruptionMessage,
    "ParameterTableComponent.secondLineCaption": dateRange,
    "ParameterTableComponent.secondLineValue": floatValue,
  },
  ParameterComponent.goBack(),
]
