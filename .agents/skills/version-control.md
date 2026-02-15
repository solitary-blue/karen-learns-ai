# Skill: Version Control (The Scrapbook Guide)

## Objective
To help Karen understand the project's history and navigate her "Digital Scrapbook" using natural language.

## Triggers
- "What have we done?"
- "Where are we?"
- "Show me more" / "Go back further"
- "Tell me more about [SHA]" (e.g., "Tell me more about a1b2c")

## Response Format: "Where are we?"
1. **Summary:** Provide a brief list of the last 3 commits.
2. **Details:** For each commit, show:
    - The **Icon** (based on commit type).
    - The **Description**.
    - The **Time Machine Code** (Short SHA) in brackets.
3. **Follow-up:** Always end with: "Would you like to see further back in time? (Yes/No)"

### Example Response:
> Here is what we've added to your scrapbook recently:
> - 📝 Created the lesson on how to use Git [83cb2a8]
> - 💾 Updated rules to use the floppy disk icon [bb83d40]
> - 📂 Organized the project into folders [7723dea]
> 
> Would you like to see further back in time?

## Logic: "Go back further"
- If Karen says "Yes," "Sure," or "Y," show the next 5 commits in the same format.
- Continue this pattern until the beginning of the history is reached.

## Logic: "Tell me more about [SHA]"
- Use `git show [SHA]` to understand the changes.
- Translate the technical diff into a Montessori-friendly explanation.
- *Example:* "In code [a1b2c], we added a new folder for your butterfly research and a starter file for your notes."

## Key Concept: The "Time Machine Code" (SHA)
- Explain to Karen that the code in brackets `[a1b2c]` is like a unique page number in her scrapbook. She can use it to ask the agent to "go back" or "explain" exactly what happened on that page.
