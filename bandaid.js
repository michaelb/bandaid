
const rules = [
  emdash,
  overused_words,
  sentence_structures,
  ro3,
  bullet_points,
  giveaway
];

function judge(text) {

  let score = 0;
  for (let rule of rules) {
    score += rule.apply(text) * rule.weight;
  }
  console.log("bandaid score: " + score + " for text: " + text);
  return score;
}

function normalize(text) {
  let normalized_text = text.toLowerCase().trim();
  if (normalized_text.length > 0) {
    normalized_text += " ";
  }
  return normalized_text.replaceAll("’", "'");
}

/**
 * Judge text nodes for AI-generated-ness
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the emoji substitution is done inline.
 */
function replaceText(node) {
  // We don't want to alter the DOM aside for text-node markers
  let content = "";
  if (node.nodeType === Node.TEXT_NODE) {
    // This node only contains text.

    // Skip textarea nodes
    if (node.parentNode &&
      node.parentNode.nodeName === 'TEXTAREA') {
      return;
    }

    content = normalize(node.textContent);
    if (content.length < 256) {
      return content; // don't judge short strings on their own
      // but rather, try to combine them with their siblings
    } else if (content.length > 30000) {
      // very long stuff, don't try to analyze it, it must not
      // be something intended for a read
    }

  } else {
    // This node contains more than just text, call replaceText() on each
    // of its (original) children (don't run replaceText over nodes
    // created in replaceText()! )
    let originNodes = []
    for (let i = 0; i < node.childNodes.length; i++) {
      originNodes.push(node.childNodes[i])
    }
    for (const node of originNodes) {
      content += replaceText(node);
    }
  }

  if (content.length >= 256) {
    // "percentage" of likeliness to be AI-generated (relatively arbitrary)
    let aid = judge(content);

    let threshold = 50;
    // be easy on small text to avoid false positives,
    // but stricter on longer ones
    if ((aid > threshold) || (aid > threshold / 2 && content.length > 500)) {
      // add a marker just before the text
      let parentNode = node.parentNode;
      let marker = document.createTextNode("⚠️🩹⚠️");
      parentNode.insertBefore(marker, node);
    }
  } else {
    return content;
  }
  return "";
}

// Start the recursion from the body tag.
replaceText(document.body);

// Now monitor the DOM for additions/changes
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});

