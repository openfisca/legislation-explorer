description: "Navigating to an parameter should show its current and past values",

steps: [
  SearchBarComponent.searchFor(smicQuery),
  AppComponent.goToFirstResult(),
  {
    "DetailsComponent.description": smicResultDescription,
    "ParameterTableComponent.firstLineCaption": ongoingDateRange,
    "ParameterTableComponent.firstLineValue": floatValue,
    "ParameterTableComponent.secondLineCaption": dateRange,
    "ParameterTableComponent.secondLineValue": floatValue,
  },
  DetailsComponent.goBack(),
]
