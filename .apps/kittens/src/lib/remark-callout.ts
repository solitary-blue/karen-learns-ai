import { visit } from 'unist-util-visit';
import * as icons from 'lucide';
import { loadCalloutConfig } from './callout-config';

// Helper to convert Lucide icon definition to SVG string
function renderIconToSvg(iconName: string, className: string): string {
  const iconDef = (icons as any)[iconName] || (icons as any)['FileText'];
  
  if (!iconDef || !Array.isArray(iconDef)) {
    return `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  const children = iconDef.map((child: any) => {
    const [tag, attrs] = child;
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');
    return `<${tag} ${attrString}></${tag}>`;
  }).join('');

  return `<svg class="${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;
}

export function remarkCallout() {
  return (tree: any) => {
    visit(tree, 'blockquote', (node: any, index: number | undefined, parent: any) => {
      if (!node.children || node.children.length === 0) return;

      const firstChild = node.children[0];
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return;

      const firstTextNode = firstChild.children[0];
      if (firstTextNode.type !== 'text') return;

      const match = firstTextNode.value.match(/^\[!([a-zA-Z0-9+-]+)\](?: ([^\n]*))?(?:$|\n)/);
      if (!match) return;

      const [fullMatch, typeRaw, titleRaw] = match;
      const type = typeRaw.toLowerCase();
      const configData = loadCalloutConfig();
      const configMap = configData.callouts || {};
      const config = configMap[type] || configMap['note'] || { title: 'Note', icon: 'FileText' }; 
      
      const title = titleRaw ? titleRaw.trim() : (config.title || type.charAt(0).toUpperCase() + type.slice(1));
      
      const iconSvg = renderIconToSvg(config.icon || 'FileText', "w-5 h-5 mr-2 inline-block align-text-bottom");
      
      const titleNode = {
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: ['callout-title', 'flex', 'items-center', 'font-bold', 'px-4', 'py-2', config.color, 'border-b', config.borderColor] }
        },
        children: [
          { type: 'html', value: iconSvg },
          { type: 'text', value: title }
        ]
      };

      const newContentChildren = [...node.children];
      const firstPara = newContentChildren[0];
      
      // Calculate length to remove. 
      // The match[0] includes the newline if present.
      // We want to remove the directive line.
      
      if (match[0].length === firstTextNode.value.length) {
        firstPara.children.shift();
      } else {
        firstTextNode.value = firstTextNode.value.substring(match[0].length);
        // If the match included the newline, we are good.
        // If there are remaining newlines at start (unlikely given regex), trim?
        // Actually, if match ended with \n, the remaining text starts after it.
      }
      
      if (firstPara.children.length === 0) {
        newContentChildren.shift();
      }
      
      const contentNode = {
        type: 'blockquote', 
        data: {
          hName: 'div',
          hProperties: { className: ['callout-content', 'px-4', 'py-3'] }
        },
        children: newContentChildren
      };

      node.type = 'blockquote'; 
      node.data = {
        hName: 'div',
        hProperties: { 
          className: [
            'callout', 
            `callout-${type}`, 
            'my-4', 
            'rounded-md', 
            'border', 
            'overflow-hidden',
            config.backgroundColor, 
            config.borderColor
          ] 
        }
      };
      
      node.children = [titleNode, contentNode];
    });
  };
}
