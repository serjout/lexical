import {TextMatchTransformer} from '@lexical/markdown';

export const HTML_BR: TextMatchTransformer = {
  dependencies: [],
  export: (node) => null,
  importRegExp: /^<br\/>|<br>$/,
  regExp: /^<br\/>|<br>$/,
  replace: (textNode, match) => {
    const [br] = match;

    if (br) {
      textNode.setTextContent('\n');
    }
  },
  trigger: '>',
  type: 'text-match',
};
