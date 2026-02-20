# Kittens — Your Lesson Viewer

Kittens is a quiet little app that turns your lesson notes into a slideshow you can step through at your own pace — like turning the pages of a beautifully laid-out book.

## Opening a Lesson

In your terminal, from the project folder, run:

```
apps/kittens
```

It will install anything it needs (on first run), start the server, and open your browser automatically.

It will load the default lesson automatically. To open a different lesson, add its name to the URL:

```
http://localhost:3000?lesson=03_llm_memory_KAREN
```

The name matches the filename in the `curriculum/` folder (without the `.md` extension).

## Navigating Slides

Think of each lesson as a set of cards laid out in a row. You move through them one at a time.

| Action | How |
|---|---|
| **Next slide** | Press **Right arrow** or **Down arrow**, or hover near the bottom of the screen and click |
| **Previous slide** | Press **Left arrow** or **Up arrow**, or hover near the top of the screen and click |
| **Jump to any slide** | Hover over the top-left corner — a small icon appears. Click it to open the lesson overview, then pick a slide. |
| **Close the overview** | Press **Escape** or click outside the panel |

The controls stay hidden until you need them so nothing distracts from the content.

## Troubleshooting

| Problem | What to try |
|---|---|
| Page is blank or says "Preparing the environment..." forever | Check the terminal — is the dev server still running? Try stopping it (Ctrl+C) and running `npm run dev` again. |
| "Oops! Failed to load lesson" | Make sure the lesson file exists in the `curriculum/` folder and the filename matches what's in the URL. |
| Styling looks off (no cream background, no gold accents) | Run `npm install` to make sure all dependencies are installed, then restart the dev server. |
| Arrow keys aren't working | Click somewhere on the page first so the browser knows you're focused on the lesson. |
