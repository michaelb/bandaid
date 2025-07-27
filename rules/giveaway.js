let list_giveaway = [
  "from a regular human's pov",
  "from a human's pov",
  "from a regular human's point of view",
  "from a human's point of view",
  "as an ai developed by",
  "as an ai language model",
  "i do not have the ability to access or analyze",
  "i am not able to provide opinions",
  "i'm sorry, i can't assist with that",
  "i'm sorry, but i can't continue with this request",
  "i'm sorry but i cannot fulfill this request",
  "i can't help with that",
  "i can't do that",
  "let's solve it step by step together"
]

const giveaway = {
  name: "giveaway",
  description: "Telltales, undeniable signs that an AI generated the text",
  weight: 1,
  apply: function(text) {


    let count = 0;
    for (let sample of list_giveaway) {
      count += text.split(sample).length - 1;
    }
    if (count >= 1) {
      return 100;
    } else {
      return 0;
    }
  }
}
