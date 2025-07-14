const emdash = {
  name: "emdash",
  description: "em-dashes (—) characters are often used by AI, and few humans writers even know it exists, let alone how to type it",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100
    //
    // here, we consider that anything that has more than 1 em-dash
    // per 100 characters has a 80% chance of being AI-generated
    // < 100 chars texts get a pass
    // for larger texts, be more restrictive : max 2 em-dashes per 1000 chars
    if (text.length > 1000) {

      if ((text.split("—").length - 1) * 1000 / text.length > 2) {
        return 80;
      } else {
        return 0;
      }
    } else if (text.length > 100) {
      if ((text.split("—").length - 1) * 100 / text.length > 1) {
        return 80;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
