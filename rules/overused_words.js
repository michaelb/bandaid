// mostly related to exageration, vague and flowery language
let wordlist = [
  "physical",
  "enigmatic",
  "palpable",
  "pragmatic",
  "elevate",
  "insights",
  "delve",
  "delving",
  "journey",
  "showcase",
  "seamlessly",
  "seamless",
  "tapestry",
  "testament",
  "realm",
  "foster",
  "groundbreaking",
  "whimsical",
  "harness",
  "embrace",
  "supercharge",
  "underpinned",
  "spearheaded",
  "meticulously",
  "delineate",
  "multifaceted",
  "pivotal",
  "lauded",
  "profound",
  "holistic",
  "underscore",
  "leverage"
]

const overused_words = {
  name: "overused_words",
  description: "Some AI obsess about rare words",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100
    //
    const wordsArray = text.trim().split(/\s+/).filter(word => word.length > 0);

    // less than 30 words ? gets a pass
    if (wordsArray.length < 30) {
      return 0;
    }

    console.log("bandaid overused words");

    let rareWordCount = 0;
    for (let i = 0; i < wordsArray.length; i++) {
      let word = wordsArray[i];
      if (wordlist.includes(word)) {
        rareWordCount += 1;
      }
    }

    // 1 occurence every 100 words should count for 
    // 10% suspiciousness, but max 50%
    return Math.min(rareWordCount * 100 / wordsArray.length * 10, 50);

  }
}
