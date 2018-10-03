description: "Navigating to an interrupted parameter should say it doesn't exist anymore, and show its former values",

steps: [
  SearchBarComponent.searchFor(stoppedParameterQuery),
  AppComponent.goToFirstResult(),
  {
    "ParameterComponent.description": stoppedParameterDescription,
    "ParameterTableComponent.firstLineCaption": interruptionMessage,
    "ParameterTableComponent.secondLineCaption": dateRange,
    "ParameterTableComponent.secondLineValue": floatValue,
  },
  ParameterComponent.goBack(),
]
