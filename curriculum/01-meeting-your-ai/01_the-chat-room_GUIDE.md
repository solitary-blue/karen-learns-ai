# Lesson 01: The Chat Room (GUIDE PLAN)

**Goal:** Karen can open iTerm, launch both Claude and Gemini, and have her first real conversations — including watching agents create files.
**Duration:** 20–25 minutes.
**Prerequisites:** None (though she typed something in iTerm last night).
**Materials:**
- Michael's laptop with Karen's iTerm profile configured
- Claude CLI and Gemini CLI installed and authenticated
- A `workspace/` directory at the project root (agents will create it if missing)
- iTerm icon diagram (`diagrams/iterm-icon.png`) — 128×128 version of iTerm's app icon

## Key Concepts
- **The Chat Room = iTerm:** Just a text window where you type and the AI responds. Karen already knows how to text — same skill.
- **Two agents, one room:** Claude and Gemini are different tools she can reach for. Neither is "better."
- **Agents do things:** The key insight is the transition from "chatbot that talks" to "agent that acts." The folder scaffolding and slideshow tasks make this visceral.

## Lesson Flow

### 1. Opening — Connect to Last Night (1–2 mins)
- "You already typed something in here last night. Today we're going to make it real — meet both of your agents and watch them work."
- She's not starting cold. Build on the fact that she's already been in this window.

### 2. Orient to the Chat Room (1–2 mins)
- Point out the features of her profile: the kitten background, the "Karen learns AI" badge, the dark theme, the big font.
- Make it feel like _her_ space: "This is yours. I set it up for you."
- If she wants the font bigger (she probably will): bump it to 20pt. `Cmd +` works, or change it in the profile.

### 2b. The Bigger Picture (1–2 mins)
- Briefly mention Claude Cowork and Codex so she knows the terminal isn't the end state.
- Keep it light — the goal is reassurance, not a deep dive.
- If she asks about getting her own Mac, acknowledge it positively but redirect: "That's a 'down the road' thing — right now you have everything you need."
- **Redirect danger:** She may want to explore those apps now. Steer back: "We'll try them when they're ready. Today, let's get comfortable here."

### 3. Launch Claude (2–3 mins)
- Have Karen type `claude` herself.
- Celebrate the moment lightly. Let her read the welcome message.
- Let her choose her first prompt. If she freezes, suggest the Montessori one — it's on her turf.
- Watch her reaction to the first response. This is the magic moment.

### 3b. Come Back to the Lesson (30 secs)
- Teach `Cmd + Tab` for switching between iTerm and Safari. Have her practice it once or twice.
- This is a practical skill she'll use every session — worth the 30 seconds.

### 4. The Folder Scaffolding Task (3–5 mins)
- Guide her to the "create folders in workspace" prompt.
- **Key moment:** When Claude asks for permission, explain: "See? It's asking you first. You're always in charge."
- After it creates the folders, open Finder or SourceTree and show her the result. "You described what you wanted. It built it."
- Don't go deep into the file system — just let her see that real files appeared.
- If she wants to explore what was created, let her ask Claude: "What did you just create? Show me the structure."

### 4b. Finding What Claude Built (1–2 mins)
- After the folder task, have her ask Claude to open `@workspace` in Finder.
- Use this as a natural intro to `@` references — keep it brief: "The @ sign tells Claude to look for a file or folder. You don't have to be exact."
- If she asks about fuzzy matching, show a quick example (`@work` → `workspace`). Don't go deep.
- The point is she can see real files that the agent created — tangible proof.

### 5. Switch to Gemini (2–3 mins)
- Guide her through `/exit` to leave Claude.
- Have her type `gemini`. Note the different welcome style.
- If Gemini's interface differs from Claude's, acknowledge it: "Different agent, same room."

### 6. The Kittens Slideshow Task (3–5 mins)
- Guide her to ask Gemini for the slideshow. The prompt is intentionally simple ("Make a slideshow about kittens and save it in the workspace folder") — the agent's slideshow skill handles the format details.
- Point out the "Magic Phrases" callout: certain phrases ("make a slideshow", "build a lesson", etc.) trigger special skills the agents have learned. She doesn't need to explain file formats or slide structure.
- When the file is created, consider opening it in the kittens app if convenient — seeing the slideshow she just requested rendered as actual slides is a powerful moment.
- If Gemini struggles with the format, don't sweat it — just note "different agents have different strengths" and move on.

### 7. Closing & Questions (2 mins)
- Go through check-for-understanding questions.
- The first question ("What's the difference between what Claude did vs. a chatbot?") is the hinge. She should articulate that Claude _did_ something, not just _described_ something.
- Preview next lesson: "Next time we peek behind the curtain — how do they come up with answers?"
- Leave an agent running if she wants to keep chatting.

## Hinge Questions

- **"What happened when Claude created the folders?"** → She should say Claude actually made real files/folders on the computer. If she says "it told me about folders," replay the moment and show the files in Finder.
- **"What's the difference between Claude and a chatbot like ChatGPT's web interface?"** → She should get at the idea that Claude _does things_ (creates files, takes actions). If she focuses on personality differences instead, redirect: "Yes, and what about when it created those folders? Could a regular chatbot do that?"
- **"Could you use either agent for the same task?"** → Yes. They both live in The Chat Room and both can do things. This sets up future exploration of when to use which.

## Anticipated Difficulties

- **Terminal anxiety (mild):** She's seen you use iTerm and typed in it last night, so this should be reduced. If she still seems tense: "Remember last night? Same window. You already know this."
- **Font size:** She'll likely want 20pt. Be ready to bump it up. This is a comfort thing — take 10 seconds and do it.
- **Long agent responses:** Both Claude and Gemini can be verbose. If she seems overwhelmed by a wall of text: "You don't need to read every word. Skim it like a long email — the key part is it understood you."
- **Permission prompts:** When Claude asks to create files, she may hesitate. Reassure: "It's asking because you're in charge. Say yes — we're experimenting in the workspace folder, that's what it's for."
- **Gemini differences:** Gemini CLI may have different UX conventions (different permission flow, different formatting). Don't compare in detail — just "different agent, same idea."
- **Shared machine worry:** If she asks about messing up your stuff: "You have your own profile, and we're working in a project folder just for you. You can't accidentally touch my work."
- **Safety concern anxiety:** The updated safety note is honest about file operations needing care. If she seems nervous: "The agents always ask first, and git keeps a backup of everything. You'd have to work pretty hard to cause a real problem."
- **@ reference confusion:** She may not grasp fuzzy matching right away. Keep it simple: "Just type @ and the name, and Claude will figure it out." She'll learn by doing.
- **Future-apps rabbit hole:** Mentioning Claude Cowork and Codex might spark a lot of questions. Redirect gently: "Those are coming — for now this is the most powerful way to work. We'll try the new stuff together when it's ready."

## After the Lesson

- If Karen is enjoying herself, let her keep chatting. The best thing that can happen after Lesson 01 is that she doesn't want to stop.
- Note which agent she seemed more comfortable with — this is useful signal for future lessons.
- If she created the workspace folders, leave them. They're a tangible artifact of her first session — she'll see them next time and remember she built them.
