import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = ["h1", "h2", "h3", "p", "div", "br", "ul", "ol", "li", "strong", "em", "mark"];

export const sanitizeRichText = (input: string) =>
  sanitizeHtml(input, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
    enforceHtmlBoundary: true,
  });
