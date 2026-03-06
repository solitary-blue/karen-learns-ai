import { visit } from 'unist-util-visit';
import type { QABlock } from './types';

/** Recursively extract plain text from an mdast node. */
function extractText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (node.type === 'inlineCode') return '`' + node.value + '`';
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

/** Extract question/answer pairs from a list node (parent bullets = questions, nested = answers). */
function extractQAPairs(listNode: any): QABlock['items'] {
  const items: QABlock['items'] = [];

  for (const listItem of listNode.children || []) {
    if (listItem.type !== 'listItem') continue;

    const questionParts: string[] = [];
    const answerParts: string[] = [];

    for (const child of listItem.children || []) {
      if (child.type === 'paragraph') {
        questionParts.push(extractText(child));
      } else if (child.type === 'list') {
        for (const answerItem of child.children || []) {
          if (answerItem.type !== 'listItem') continue;
          for (const ansChild of answerItem.children || []) {
            if (ansChild.type === 'paragraph') {
              answerParts.push(extractText(ansChild));
            }
          }
        }
      }
    }

    const question = questionParts.join('\n');
    const answer = answerParts.join('\n');
    if (question) items.push({ question, answer });
  }

  return items;
}

/**
 * Remark plugin that detects three Q&A markdown patterns and emits
 * HTML comment markers containing serialized QABlock JSON.
 *
 * Pattern 1 — Callout Q&A:
 *   > [!QUESTION] Title
 *   > - Question text
 *   >   - Answer text
 *
 * Pattern 2 — Quiz Bullets:
 *   ## Heading #quiz
 *   - Question text
 *     - Answer text
 *
 * Pattern 3 — Kitten Chat:
 *   > [!QUIZ] Title
 *   > - Question text
 *   >   - Answer text
 */
export function remarkQA() {
  return (tree: any) => {
    // --- Patterns 1 & 3: [!QUESTION] and [!QUIZ] blockquotes ---
    visit(tree, 'blockquote', (node: any, index: number | undefined, parent: any) => {
      if (!node.children?.length || index === undefined || !parent) return;

      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph' || !firstChild.children?.length) return;

      const firstText = firstChild.children[0];
      if (firstText.type !== 'text') return;

      const match = firstText.value.match(/^\[!(QUESTION|QUIZ)\](?: ([^\n]*))?(?:$|\n)/i);
      if (!match) return;

      const qaType = match[1].toUpperCase() === 'QUIZ' ? 'chat' : 'callout';
      const title = match[2]?.trim() || (qaType === 'chat' ? 'Quiz' : 'Question');

      // Find the list among the blockquote's children
      const listNode = node.children.find((c: any) => c.type === 'list');
      if (!listNode) return; // No list → fall through to regular callout rendering

      const items = extractQAPairs(listNode);
      if (items.length === 0) return;

      const block: QABlock = { type: qaType as 'callout' | 'chat', title, items };

      parent.children[index] = {
        type: 'html',
        value: `<!--qa:${JSON.stringify(block)}:qa-->`,
      };
    });

    // --- Pattern 2: heading with #quiz + following list ---
    const toRemove: { parent: any; index: number }[] = [];

    visit(tree, 'heading', (node: any, index: number | undefined, parent: any) => {
      if (index === undefined || !parent) return;

      const text = extractText(node);
      if (!text.includes('#quiz')) return;

      const title = text.replace(/#quiz/g, '').trim();

      const nextNode = parent.children[index + 1];
      if (!nextNode || nextNode.type !== 'list') return;

      const items = extractQAPairs(nextNode);
      if (items.length === 0) return;

      const block: QABlock = { type: 'bullets', title, items };

      parent.children[index] = {
        type: 'html',
        value: `<!--qa:${JSON.stringify(block)}:qa-->`,
      };

      toRemove.push({ parent, index: index + 1 });
    });

    // Remove consumed list nodes in reverse order to preserve indices
    for (const { parent, index } of toRemove.reverse()) {
      parent.children.splice(index, 1);
    }
  };
}
