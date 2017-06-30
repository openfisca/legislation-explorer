description: "Navigating to an item of the list should show details, going back should keep the search.",

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
  }
]
