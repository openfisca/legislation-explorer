description: "Navigating to an item of the list should show details, formula should show links on variables, going back should keep the search.",

steps: [
  SearchBarComponent.searchFor(variableQuery),
  AppComponent.goToFirstResult(),
  {
    "VariableComponent.description": variableResultDescription,
    "VariableComponent.definitionPeriod": variableDefinitionPeriod,
  },
  VariableComponent.goBack(),
  {
    "SearchBarComponent.field": variableQuery
  },
  AppComponent.goToFirstResult(),
  VariableComponent.goToDependency(),
  {
    "VariableComponent.title": variableDependencyTitle,
  },
  VariableComponent.goBack(),
]
