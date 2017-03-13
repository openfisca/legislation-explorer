description: "Navigating to an item of the list should show details, going back should keep the search.",

steps: [
  SearchBarComponent.searchFor(aahQuery),
  AppComponent.goToFirstResult(),
  {
    "DetailsComponent.description": aahResultDescription
  },
  DetailsComponent.goBack(),
  {
    "SearchBarComponent.field": aahQuery
  }
]
