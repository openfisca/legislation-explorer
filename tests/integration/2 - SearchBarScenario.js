description: "The search should filter the list.",

steps: [
  SearchBarComponent.searchFor(variableQuery),
  {
    "AppComponent.firstResultName": variableResultName
  },
  SearchBarComponent.searchFor(twoWordsVariableQuery),
  {
    "AppComponent.firstResultName": twoWordsVariableResultName
  }
]
