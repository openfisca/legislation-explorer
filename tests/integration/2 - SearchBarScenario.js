description: "The search should filter the list.",

steps: [
  SearchBarComponent.searchFor(aahQuery),
  {
    "AppComponent.firstResultName": aahResultName
  },
  SearchBarComponent.searchFor(salaireBaseQuery),
  {
    "AppComponent.firstResultName": salaireBaseResultName
  }
]

