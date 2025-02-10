import {TextMatchTransformer} from '@lexical/markdown';
import {$isTextNode, IS_UNDERLINE, TextNode} from 'lexical';

const notEmptyString = (s: string) => s !== '';

export const HTML_TAG_TRANSFORMER: TextMatchTransformer = {
  dependencies: [TextNode],
  export: (node) => {
    if (!$isTextNode(node)) {
      return null;
    }

    const color = node
      .getStyle()
      .split(';')
      .find((s) => s.startsWith('color:'))
      ?.substring('color:'.length);

    let result = node.getTextContent();
    if (color) {
      result = `<span style="color:${color}">${result}</span>`;
    }

    if (node.getFormat() & IS_UNDERLINE) {
      result = `<u>${result}</u>`;
    }

    return result;
  },
  importRegExp: /<(span|u)(\s+style="([^"]*)")?>(.*?)<\/\1>/,
  regExp: /<(span|u)(\s+style="([^"]*)")?>(.*?)<\/\1>/,
  replace: (textNode, match) => {
    const [, tag, , style, content] = match;

    switch (tag) {
      case 'u': {
        textNode.setFormat(IS_UNDERLINE);
        textNode.setTextContent(content);

        break;
      }
      case 'span': {
        const color = style
          .split(';')
          .map((s) => s.trim())
          .find((s) => s.startsWith('color:'))
          ?.substring('color:'.length);

        if (color) {
          textNode.setStyle(
            [textNode.getStyle(), `color:${color}`]
              .filter(notEmptyString)
              .join(';'),
          );
          textNode.setTextContent(content);
        }

        break;
      }
      default:
        return;
    }

    if (textNode.getTextContent().includes('<')) {
      return textNode;
    }
  },
  trigger: '>',
  type: 'text-match',
};
