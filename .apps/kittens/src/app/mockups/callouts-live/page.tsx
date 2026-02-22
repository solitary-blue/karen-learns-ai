import * as React from 'react';
import { parseMarkdownToSlides } from '@/lib/markdown';

const DEMO_CONTENT = `
# Callout Examples

Here are examples of the supported callout types in our Obsidian-compatible renderer.

> [!note] Standard Note
> This is a standard note callout. It's used for general information.

> [!tip] Tip
> Pro tip: You can nest callouts!
> > [!warning] Nested Warning
> > Be careful when nesting too deep.

> [!important] Important
> This information is crucial for understanding the concept.

> [!warning] Warning
> Proceed with caution. There might be side effects.

> [!caution] Caution
> This is a more severe warning.

> [!attention] Attention
> Pay close attention to this detail.

> [!check] Check / Success
> The operation completed successfully.

> [!fail] Fail / Missing
> The operation failed. Please try again.

> [!question] Question / Help
> Do you have any questions about this topic?

> [!quote] Quote
> "The only way to do great work is to love what you do." - Steve Jobs

> [!example] Example
> Here is an example of code:
> \`\`\`typescript
> const sum = (a: number, b: number) => a + b;
> \`\`\`

> [!bug] Bug
> There seems to be a bug in the matrix.

> [!todo] To Do
> - [ ] Fix the styling
> - [x] Add more icons

## Typography Test

This is a paragraph of text to test the main body font. It should be legible and comfortable to read. **This text is bold**, *this is italic*, and this is a [link](#).

### Heading 3
#### Heading 4
##### Heading 5
`;

export default async function CalloutsLivePage() {
  // Use the existing slide parser which processes the markdown with callouts
  const slides = await parseMarkdownToSlides(DEMO_CONTENT);
  const htmlContent = slides[0]?.html || '';

  return (
    <div className="min-h-screen bg-background p-8 md:p-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-serif">Callout Live Demo</h1>
          <p className="text-xl text-muted-foreground font-sans">
            A live preview of Obsidian-style callouts with our custom renderer.
          </p>
        </div>

        {/* Render the processed HTML directly */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
