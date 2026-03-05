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
      
      const iconSvg = renderIconToSvg(config.icon || 'FileText', "w-5 h-5 mr-2 inline-block flex-shrink-0");
      
      const newContentChildren = [...node.children];
      const firstPara = newContentChildren[0];
      
      // Remove the [!type] prefix
      if (match[0].length === firstTextNode.value.length) {
        firstPara.children.shift();
      } else {
        firstTextNode.value = firstTextNode.value.substring(match[0].length);
      }
      
      if (firstPara.children.length === 0) {
        newContentChildren.shift();
      }

      const hasContent = newContentChildren.length > 0;
      const kittenName = Array.isArray(config.kittens) ? config.kittens[0] : config.kittens;
      const hasKitten = !!kittenName;

      const titleNode = {
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { 
            className: [
              'callout-title', 
              'flex', 
              'items-center', 
              'font-bold', 
              'px-4', 
              'py-2', 
              config.color, 
              // Only add border if there is content below
              hasContent ? 'border-b' : '',
              config.borderColor,
              // Vertical center title
              'min-h-[3rem]',
              // Padding for kitten if single line
              !hasContent && hasKitten ? 'pr-20' : ''
            ].filter(Boolean).join(' ')
          }
        },
        children: [
          { type: 'html', value: iconSvg },
          { type: 'text', value: title }
        ]
      };

      const childrenNodes: any[] = [titleNode];

      if (hasContent) {
        const contentNode = {
          type: 'blockquote', 
          data: {
            hName: 'div',
            hProperties: { 
              className: [
                'callout-content', 
                'px-4', 
                'py-3', 
                'flex', 
                'flex-col', 
                'justify-center', 
                'min-h-[4rem]',
                // Add right padding if there is a kitten
                hasKitten ? 'pr-20' : ''
              ].filter(Boolean).join(' ')
            }
          },
          children: newContentChildren
        };
        childrenNodes.push(contentNode);
      }

      if (hasKitten) {
        const kittenNode = {
          type: 'paragraph',
          data: {
            hName: 'img',
            hProperties: {
              src: `/api/kittens/${kittenName}`,
              className: [
                'absolute',
                'bottom-1',
                'right-1',
                'pointer-events-none',
                'h-16',
                'w-auto',
                'opacity-90'
              ].join(' ')
            }
          },
          children: []
        };
        childrenNodes.push(kittenNode);
      }

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
            'relative',
            'not-prose', // Break out of prose styles for better control
            config.backgroundColor, 
            config.borderColor
          ].join(' ')
        }
      };
      
      node.children = childrenNodes;
    });
  };
}
