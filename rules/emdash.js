const emdash = {
  name: "emdash",
  description: "em-dashes (—) characters are often used by AI, and few humans writers even know it exists, let alone how to type it",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100
    //

    let count = text.split("—").length - 1;
    // 1 occurence every 500 chars should count for 
    // 10% suspiciousness, but max 70%
    console.log("bandaid emdash couint : " + count + " , text elngth = " + text.length + ", text =" + text);
    return Math.min(count * 500 / text.length * 10, 70);

  }
}
