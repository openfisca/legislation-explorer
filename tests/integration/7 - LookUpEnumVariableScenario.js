description: "Navigating to an enum variable should show its possible values",

steps: [
  SearchBarComponent.searchFor(enumVariableQuery),
  AppComponent.goToFirstResult(),
  {
    "VariableComponent.firstPossibleValue": enumVariableFirstValue,
  },
  VariableComponent.goBack(),
]
