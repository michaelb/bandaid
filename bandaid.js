// silence all logs (comment during debugging)
console.log = function() { }

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
    let rule_score = rule.apply(text) * rule.weight;
    if (rule_score > 0) {
      console.log("bandaid score: " + rule_score + " due to rule: " + rule.name);
    }
    score += rule_score;
  }
  if (score > 0) {
    console.log("bandaid score total: " + score + " for text: " + text);
  }
  return score;
}

function normalize(text) {
  let normalized_text = text.toLowerCase().trim();
  if (normalized_text.length > 0) {
    normalized_text += "\n";
  }
  return normalized_text.replaceAll("’", "'");
}

var styles = `
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 350px;
  bottom: 100%;
  left: 50%;
  margin-left: -0px; /* Use half of the width (120/2 = 60), to center the tooltip */
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
 
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
`
var styleSheet = document.createElement("style")
styleSheet.textContent = styles
document.head.appendChild(styleSheet)

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
    if (content.length < 16) {
      // do nothing at all,

    } else if (content.length < 256) {
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

  if (content.length >= 256 && content.length <= 30000) {
    // "percentage" of likeliness to be AI-generated (relatively arbitrary)
    let aid = Math.round(judge(content));

    browser.storage.local.get(['dtl', 'dts']).then(
      data => {
        mark(node, aid, data.dts, data.dtl, content);
      }).catch(error => {
        console.log("error retrieving stored threshold" + e)
        console.log("using the defautl thresholds : 50 for short text, 25 for long");
        mark(node, aid, 50, 25);
      })
  } else {
    return content;
  }
  return "";
}

function mark(node, aid, short_threshold, long_threshold, content) {
  let threshold = short_threshold;
  if (content.length > 500) {
    threshold = long_threshold;
  }

  console.log("bandaid score threshold: " + threshold + ", aid = " + aid + " for text of len " + content.length);

  if ((aid >= threshold)) {
    console.log("bandaid ai-generated found, marking as such")
    // add a marker just before the text
    let parentNode = node.parentNode;
    let markerdiv = document.createElement("bandaid_marker");
    let marker = document.createTextNode("⚠️🩹⚠️");
    let tooltip_div = document.createElement("bandaid_tooltip");
    let tooltip = document.createTextNode("bandaid detected the upcoming text is likely AI-generated (score " + aid + ", threshold = " + threshold + ")");
    markerdiv.classList.add("tooltip");
    tooltip_div.classList.add("tooltiptext");

    tooltip_div.appendChild(tooltip);
    markerdiv.appendChild(marker);
    markerdiv.appendChild(tooltip_div);
    markerdiv.className = "tooltip";
    parentNode.insertBefore(markerdiv, node);
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

