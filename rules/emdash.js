const emdash = {
  name: "emdash",
  description: "em-dashes (—) characters are often used by AI, and few humans writers even know it exists, let alone how to type it",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100
    //

    let parts = text.split("—");
    let count = parts.length - 1;
    if (count > 1 && Date.parse(parts[0]) != NaN) {
      // the pattern <date> <emdash> is commonly found
      // in press articles, even pre-AI ones, let's not count it
      count -= 1;
    }
    // 1 occurence every 500 chars should count for 
    // 10% suspiciousness, but max 70%
    console.log("bandaid emdash couint : " + count);
    return Math.min(count * 500 / text.length * 10, 50);

  }
}
