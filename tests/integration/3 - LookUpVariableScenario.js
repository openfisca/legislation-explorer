description: "Navigating to an item of the list should show details, formula should show links on variables, going back should keep the search.",

steps: [
  SearchBarComponent.searchFor(aahQuery),
  AppComponent.goToFirstResult(),
  {
    "VariableComponent.description": aahResultDescription,
    "VariableComponent.definitionPeriod": aahDefinitionPeriod,
  },
  VariableComponent.goBack(),
  {
    "SearchBarComponent.field": aahQuery
  },
  AppComponent.goToFirstResult(),
  VariableComponent.goToDependency(),
  {
    "VariableComponent.title": aahDependencyTitle,
  },
  VariableComponent.goBack(),
]
