description: "Navigating to a scale should show its current and past values",

steps: [
  SearchBarComponent.searchFor(impotRevenuBaremeQuery),
  AppComponent.goToFirstResult(),
  {
    "ParameterComponent.description": impotRevenuBaremeResultDescription,
    "ScaleTableComponent.headerColumn1": dateHeader,
    "ScaleTableComponent.headerColumn2": trancheHeader,
    "ScaleTableComponent.headerColumn3": tauxMarginalHeader,
    "ScaleTableComponent.firstBracketColumn1": ongoingDateRange,
    "ScaleTableComponent.firstBracketColumn2": thresholdRange,
    "ScaleTableComponent.firstBracketColumn3": rate,
    "ScaleTableComponent.secondBracketColumn2": thresholdRange,
    "ScaleTableComponent.secondBracketColumn3": rate,
  },
  ParameterComponent.goBack(),
]
