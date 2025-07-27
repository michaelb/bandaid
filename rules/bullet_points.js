const bullet_points = {
  name: "bullet points",
  description: "AI overuses bullet points",
  weight: 1,
  apply: function(text) {
    // return a 'probability' of being AI-generated between 1 and 100

    if (text.length < 500) {
      // this only works for longer texts
      return 0;
    }

    let count = text.split("1. ").length - 1;
    count += text.split("2. ").length - 1;
    count += text.split("3. ").length - 1;
    count += text.split("4. ").length - 1;
    count += text.split("5. ").length - 1;
    count += text.split("• ").length - 1;
    count += text.split("🔹").length - 1;

    if (count < 10) {
      //more than 500 chars and less than 10 bullet point ?
      //maybe just bad luck to have this many, don't raise the score 
      //just for that
      return 0;
    }


    // 10 bullet point every 7000 chars should count for 
    // 10% suspiciousness, but max 40%
    console.log("bandaid bullet point count : " + count + " , text length = " + text.length + ", text =" + text);
    return Math.min(count * 7000 / 10 / text.length * 10, 40);

  }
}
