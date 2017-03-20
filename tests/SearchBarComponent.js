field: "#search-input",
submitButton: "button[type=submit]",

searchFor: function searchFor(term) {
  return this.setField(term)()
    .then(this.submit());
}
