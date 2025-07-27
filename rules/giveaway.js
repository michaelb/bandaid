let list_giveaway = [
  "from a regular human's pov",
  "from a human's pov",
  "from a regular human's point",
  "from a human's point",
  "as an ai developed by",
  "as an ai language model",
  "i do not have the ability to access or analyze",
  "i am not able to provide opinions",
  "i'm sorry, i can't assist with that",
  "i'm sorry, but i can't continue with this request"
]

const giveaway = {
  name: "giveaway",
  description: "Telltales, undeniable signs an AI generated that text",
  weight: 1,
  apply: function(text) {


    let count = 0;
    for (let sample of list_giveaway) {
      count += text.split(sample).length - 1;
      console.log("bandaid found sample " + sample + " in text ? " + text + count)
    }
    if (count >= 1) {
      return 100;
    } else {
      return 0;
    }
  }
}
