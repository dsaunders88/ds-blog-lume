export function readingTime(text) {
  const wordsPerMinute = 200;
  const strippedText = stripTags(text);
  const words = countWords(strippedText);
  // console.log(words, `words per min: ${Math.round(words / wordsPerMinute)}`);
  return `${Math.round(words / wordsPerMinute)} min. read`;
}

// Remove all HTML tags: https://regex101.com/r/qS0gE2/1
function stripTags(htmlText) {
  return htmlText.replace(/<([^>]+)>/gi, "");
}

// Remove white-space and line breaks, return array of words: https://stackoverflow.com/questions/18679576/counting-words-in-string
function countWords(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, ""); //exclude start and end white-space
  s = s.replace(/[ ]{2,}/gi, " "); //2 or more space to 1
  s = s.replace(/\n /, "\n"); // exclude newline with a start spacing
  return s.split(" ").filter(function (str) {
    return str != "";
  }).length; // return length
}
