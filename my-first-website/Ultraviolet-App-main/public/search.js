function search(input, template) {
  try {
    return new URL(input).toString();
  } catch (err) {
    if (input.includes('.') && !input.includes(' ')) {
      return `https://${input}`;
    }
    return template.replace('%s', encodeURIComponent(input));
  }
}
