
const rules = [
  emdash
];

function judge(text_in) {


  let text = text_in.trim();
  if (text.length < 32) {
    return 0; // don't judge short strings
  }

  let score = 0;
  let weigth = 0;
  // to compute a better probability of 'being AI-generated'
  // with several 'OR' metrics, compute the reverse score (so it
  // makes sense to add it up), and finally re-reverse it
  for (const rule of rules) {
    score += (100 - rule.apply(text)) * rule.weight;
    weigth += rule.weight;
  }
  return 100 - (score / weigth);
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
  if (node.nodeType === Node.TEXT_NODE) {
    // This node only contains text.

    // Skip textarea nodes
    if (node.parentNode &&
      node.parentNode.nodeName === 'TEXTAREA') {
      return;
    }

    let content = node.textContent;

    // "percentage" of likeliness to be AI-generated (relatively arbitrary)
    let aid = judge(content);

    if (aid > 50) {
      // add a marker just before the text
      let parentNode = node.parentNode;
      let marker = document.createTextNode("⚠️");
      parentNode.insertBefore(marker, node);
    }

  }
  else {
    // This node contains more than just text, call replaceText() on each
    // of its (original) children (don't run replaceText over nodes
    // created in replaceText()! )
    let originNodes = []
    for (let i = 0; i < node.childNodes.length; i++) {
      originNodes.push(node.childNodes[i])
    }
    for (const node of originNodes) {
      replaceText(node);
    }
  }
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

