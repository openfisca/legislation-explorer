description: "Navigating to a parameter should show its current and past values",

steps: [
  SearchBarComponent.searchFor(parameterQuery),
  AppComponent.goToFirstResult(),
  {
    "ParameterComponent.title": parameterResultTitle,
    "ParameterComponent.description": parameterResultDescription,
    "ParameterTableComponent.firstLineCaption": ongoingDateRange,
    "ParameterTableComponent.firstLineValue": floatValue,
    "ParameterTableComponent.secondLineCaption": dateRange,
    "ParameterTableComponent.secondLineValue": floatValue,
  },
  ParameterComponent.goBack(),
]
