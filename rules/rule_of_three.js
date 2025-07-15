const ro3 = {
  name: "rule of three",
  description: "3-items 'A, B and C' statements",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100
    let sentences = text.split(".");

    let count = 0;
    for (let sentence of sentences) {
      let parts = sentence.split(",");
      let nb_of_commas = parts.length - 1;
      let has_and_or = (parts[1].includes("and") || parts[1].includes("or"));
      let has_and_or_not_just_after_comma = !(sentence.includes(", and") || sentence.includes(", or"));

      if (nb_of_commas == 1 && has_and_or && has_and_or_not_just_after_comma) {
        count += 1;
      }
    }

    console.log("bandaid ro3: count " + count + "   text length: ", text.length);
    // 1 occurence every 1000 chars should count for 
    // 10% suspiciousness, but max 50%
    return Math.min(count * 1000 / text.length * 10, 50);
  }

}
