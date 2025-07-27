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


    // only counts occurences of 'suspicious' words once,
    // to avoid flagging articles about topics that would obviously
    // use one of these often (_physical_ activities, test _harness_)
    let rareWordCount = 0;
    for (let i = 0; i < wordlist.length; i++) {
      let word = wordlist[i];
      if (wordsArray.includes(word)) {
        rareWordCount += 1;
        continue;
      }
      // with 's' at the end
      word = word + "s";
      if (wordsArray.includes(word)) {
        rareWordCount += 1;
      }

    }
    console.log("bandaid overused words: " + rareWordCount);

    // one or two occurences overall are forgiveable
    if (rareWordCount <= 2) {
      return 0;
    }

    // but each additional occurence every 200 words should count for 
    // 10% suspiciousness, but max 50%
    return Math.min((rareWordCount - 2) * 200 / wordsArray.length * 10, 50);

  }
}
