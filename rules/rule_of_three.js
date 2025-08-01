const ro3 = {
  name: "rule of three",
  description: "3-items 'A, B and C' statements",
  weight: 1,
  apply: function(text) {

    if (text.length < 400) {
      return 0;
    }

    // return a 'probability' of being AI-generated between 1 and 100
    let sentences = text.split(".");

    let count = 0;
    for (let sentence of sentences) {
      console.log("bandaid " + sentence)
      let parts = sentence.split(",");
      let nb_of_commas = parts.length - 1;
      if (nb_of_commas < 2) {
        continue;
      }
      let has_and_or = (parts[1].includes("and ") || parts[1].includes("or "));
      let has_and_or2 = (parts[2].includes("and ") || parts[2].includes("or "));
      let has_and_or_not_just_after_comma = !(sentence.includes(", and ") || sentence.includes(", or "));

      if ((nb_of_commas == 1 && has_and_or && has_and_or_not_just_after_comma) || (nb_of_commas == 2 && has_and_or2 && !has_and_or_not_just_after_comma)) {
        count += 1;
      }
    }

    console.log("bandaid ro3: count " + count + "   text length: " + text.length);
    // 1 occurence every 400 chars should count for 
    // 10% suspiciousness, but max 50%
    return Math.min(count * 400 / text.length * 10, 50);
  }

}
