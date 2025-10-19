let list_sentence_structures = [
  "not just",
  "n't just",
  "not only",
  "not simply",
  "n't simply",
  "but also",
  "or even",
  "in addition",
  "might",
  "it is often though",
  "on the other hand",
  "one could argue",
  "must also consider",
  "must also be considered",
  "in conclusion"
]

const sentence_structures = {
  name: "sentence_structures",
  description: "AI often uses parallel sentence structures and hedging language",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100

    // only applies to texts longer than 200 chars
    if (text.length < 200) {
      return 0;
    }

    let count = 0;
    for (let sample of list_sentence_structures) {
      count += text.split(sample).length - 1;
    }

    console.log("bandaid structure: count " + count + "   text length: ", text.length);
    // 1 occurence every 500 chars should count for 
    // 10% suspiciousness, but max 50%
    return Math.min(count * 500 / text.length * 10, 50);
  }
}
