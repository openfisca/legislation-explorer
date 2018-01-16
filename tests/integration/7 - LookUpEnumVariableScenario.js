description: "Navigating to an enum variable should show its possible values",

steps: [
  SearchBarComponent.searchFor(enumVariableQuery),
  AppComponent.goToFirstResult(),
  {
    "VariableComponent.title": enumVariableTitle,
    "VariableComponent.defaultValue": enumVariableDefault,
  },
  VariableComponent.goBack(),
]
