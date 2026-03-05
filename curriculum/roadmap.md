# Curriculum Roadmap: Karen Learns Agentic AI

**Status:** In Progress

Karen is a Montessori teacher working on her Master's degree who is learning to use agentic AI effectively. This roadmap builds from AI foundations through practical agent workflows, grounded in her classroom experience.

Three threads run through the entire curriculum:
1. **Agentic AI** — understanding and using AI agents that take action, not just chat
2. **The Second Brain** — building a personal knowledge system (Obsidian + Slack + agents) that grows with Karen
3. **The Terminal** — just enough comfort with iTerm and the command line to work in Claude/Gemini CLI (we may build a web GUI as a fallback if the terminal proves too intimidating, so we keep this thread light)

---

## Section 1: Meeting Your AI (Foundations)

**Goal:** Understand what AI is, how it works at a high level, and build comfort interacting with it.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 01 | The Chat Room | Opening iTerm; what a terminal is; launching Claude/Gemini CLI; it's just a text chat | The Chat Room | |
| 02 | Meet Your AI Assistant | What an LLM is; how it generates text | The Library & The Librarian | Yes — fan-out: prompt → possible responses |
| 03 | Your Digital Scrapbook | Git basics; version history as safety net | Digital Scrapbook / Time Machine | **Exists** |
| 04 | How AI Remembers | Context window vs. persistent files | Working Notepad / Permanent Ledger | **Exists** |
| 05 | The Art of Asking | Writing clear prompts; specificity matters | Asking Good Questions | Yes — side-by-side: vague vs. specific prompt |
| 06 | When AI Gets Creative | Hallucinations; verifying AI output | Creative Guessing | Yes — assembly line: input → confident-sounding wrong answer |

**Section Review:** Karen can open iTerm, launch a CLI agent, explain what AI is, write basic prompts, save her work, and knows to verify AI output.

---

## Section 2: Communicating Effectively with AI

**Goal:** Move from basic prompting to getting reliably useful results through technique and iteration.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 07 | Setting the Scene | Giving context and background in prompts | The Briefing | Yes — comparison: with/without context |
| 08 | The Back-and-Forth | Iterating on AI output; asking for revisions | The Conversation Dance | |
| 09 | Giving AI a Role | Personas and system prompts | Wearing Different Hats | Yes — fan-out: one AI, multiple persona outputs |
| 10 | Breaking Big Asks into Steps | Decomposing complex requests | The Recipe Card | Yes — assembly line: big task → step breakdown |
| 11 | Spotting Good vs. Bad Output | Evaluating AI quality; when to push back | The Quality Check | |

**Section Review:** Karen can craft effective prompts, iterate to improve output, use personas, and critically evaluate what AI gives her.

---

## Section 3: From Chatbot to Agent

**Goal:** Understand what makes an agent different from a chatbot, and how agents think and act.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 12 | Chatbots vs. Agents | The difference: agents take action, chatbots just talk | The Classroom Helper vs. The Student Teacher | Yes — side-by-side comparison |
| 13 | The Agent Loop | Think → Act → Observe → Repeat | The Think-Do-Check Cycle | Yes — spiral/cycle diagram |
| 14 | Tools: How Agents Touch the World | File operations, search, web access, code execution | The Agent's Toolbox | Yes — fan-out: agent → tools |
| 15 | Reading What Your Agent Does | Understanding agent output; tool calls and reasoning | Reading the Agent's Work Journal | |
| 16 | What Agents Can and Can't Do | Capabilities, limitations, and when to step in | The Guardrails | Yes — gap/boundary diagram |

**Section Review:** Karen understands the agent loop, can read agent output, and knows when an agent needs human guidance.

---

## Section 4: Your Agent Workspace

**Goal:** Understand how the workspace (files, instructions, skills) shapes what an agent can do.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 17 | Files, Folders, and Projects | How agents read and write files; project organization | The Prepared Classroom | Yes — tree diagram of workspace |
| 18 | Instructions: Teaching Your Agent | CLAUDE.md, AGENTS.md, and how agents follow rules | The Classroom Rules | Yes — hierarchy: global → project → task instructions |
| 19 | Skills: Specialized Knowledge | How skills give agents expertise for specific tasks | The Lesson Plan Binder | |
| 20 | Sessions and Fresh Starts | Managing context, when to restart, what persists | The School Day | Yes — timeline: session lifecycle |

**Section Review:** Karen understands her workspace structure and how instructions/skills shape agent behavior.

---

## Section 5: Building Your Second Brain

**Goal:** Set up Obsidian as a personal knowledge system and connect it to agents via Slack and MCP, so Karen's notes and memories are always available.

**Architecture context:** This section teaches Karen the `mem-mem` system — Obsidian as source of truth, a Slack channel for quick capture, a vector database for semantic search, and MCP so every agent can access her knowledge.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 21 | What Is a Second Brain? | Why a personal knowledge system matters; Obsidian intro | The Memory Palace | Yes — convergence: scattered notes → organized vault |
| 22 | Your Obsidian Vault | Creating notes, linking ideas, tags and folders | The Notebook with Superpowers | |
| 23 | Capturing Thoughts on the Go | The Slack channel as quick-capture; typing a thought and having it stored | The Quick-Capture Inbox | Yes — assembly line: Slack message → processed thought → vault |
| 24 | How Your Agents Remember You | MCP: giving agents access to your vault; semantic search | The Shared Memory | Yes — fan-out: vault → multiple agents all accessing same knowledge |
| 25 | The Daily Review | Curating what sticks: approving, editing, and discarding memory candidates | The Evening Reflection | Yes — convergence: session logs + captures → review → approved memories |

**Section Review:** Karen has Obsidian set up, can capture thoughts via Slack, understands how agents access her notes, and has a daily review habit.

---

## Section 6: Agent Workflows in Practice

**Goal:** Use agents for real tasks Karen cares about — research, writing, lesson planning, and organization — with her Second Brain as a persistent resource.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 26 | Research Assistant | Using agents to find, summarize, and save to your vault | The Research Helper | |
| 27 | Writing Partner | Drafting, editing, and refining text with an agent | The Writing Desk | |
| 28 | Lesson Planner | Creating lesson plans and student materials with AI | The Lesson Workshop | |
| 29 | Organizing Your Knowledge | Structuring your vault; building reference docs and glossaries | The Librarian's System | Yes — tree: vault organization strategy |
| 30 | Multi-Step Workflows | Chaining tasks together; agents that research, draft, and organize | The Assembly Line | Yes — assembly line: multi-stage workflow |
| 31 | When Things Go Wrong | Debugging agent mistakes; course-correcting mid-task | The Troubleshooting Guide | |

**Section Review:** Karen can direct agents through practical workflows, with her Second Brain as the persistent knowledge layer underneath.

---

## Section 7: AI in the Classroom

**Goal:** Apply AI knowledge to Karen's professional context — teaching, student materials, and responsible use.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 32 | AI-Assisted Lesson Planning | End-to-end lesson creation with agent support | The Co-Teacher | |
| 33 | Creating Student Materials | Worksheets, rubrics, differentiated resources | The Materials Workshop | |
| 34 | Teaching Students About AI | Age-appropriate AI literacy for Karen's students | The AI Circle Time | Yes — tree: what kids should know by age |
| 35 | Ethics and Responsible Use | Bias, privacy, academic integrity, appropriate use | The Compass | Yes — convergence: multiple concerns → responsible practice |

**Section Review:** Karen can use AI in her professional practice and teach students about it responsibly.

---

## Section 8: Growing Your Toolkit

**Goal:** Build independence — Karen can evaluate, customize, and extend her AI setup on her own.

| # | Lesson | Core Concept | Friendly Name | Diagram? |
|---|--------|-------------|---------------|----------|
| 36 | Evaluating AI Tools | Comparing models and tools; choosing the right one | The Tool Shed | Yes — side-by-side: model comparison |
| 37 | Customizing Your Agent | Writing your own instructions and skills | The Workshop | |
| 38 | Your AI Journey: What's Next | Review of everything learned; growing your Second Brain | The Road Ahead | |

**Section Review:** Karen is an independent, critical AI user who can adapt her tools and knowledge system to her needs.

---

## Vocabulary Map

Friendly names introduced across the curriculum, mapped to technical terms:

| Friendly Name | Technical Term | Introduced |
|---------------|---------------|------------|
| The Chat Room | Terminal / iTerm | Lesson 01 |
| The Library & The Librarian | LLM / Inference | Lesson 02 |
| Digital Scrapbook | Git Repository | Lesson 03 |
| Time Machine Code | Commit SHA | Lesson 03 |
| Working Notepad | Context Window | Lesson 04 |
| Permanent Ledger | Committed Files | Lesson 04 |
| Fresh Mind | New Session | Lesson 04 |
| Asking Good Questions | Prompt Engineering | Lesson 05 |
| Creative Guessing | Hallucination | Lesson 06 |
| The Briefing | System Prompt / Context | Lesson 07 |
| The Conversation Dance | Iterative Prompting | Lesson 08 |
| Wearing Different Hats | Personas / Roles | Lesson 09 |
| The Recipe Card | Task Decomposition | Lesson 10 |
| The Quality Check | Output Evaluation | Lesson 11 |
| The Classroom Helper vs. Student Teacher | Chatbot vs. Agent | Lesson 12 |
| The Think-Do-Check Cycle | Agent Loop | Lesson 13 |
| The Agent's Toolbox | Tool Use / Function Calling | Lesson 14 |
| The Agent's Work Journal | Agent Trace / Reasoning Log | Lesson 15 |
| The Guardrails | Capability Boundaries | Lesson 16 |
| The Prepared Classroom | Workspace / Project Structure | Lesson 17 |
| The Classroom Rules | Instructions (CLAUDE.md) | Lesson 18 |
| The Lesson Plan Binder | Skills | Lesson 19 |
| The School Day | Session Lifecycle | Lesson 20 |
| The Memory Palace | Second Brain / PKM | Lesson 21 |
| The Notebook with Superpowers | Obsidian Vault | Lesson 22 |
| The Quick-Capture Inbox | Slack Capture Channel | Lesson 23 |
| The Shared Memory | MCP (Model Context Protocol) | Lesson 24 |
| The Evening Reflection | Daily Review / Memory Curation | Lesson 25 |
| The Librarian's System | Knowledge Organization | Lesson 29 |

---

## The Three Threads

### Thread 1: Agentic AI

The primary curriculum arc. Lessons 1–20 build understanding of what agents are and how to direct them. Lessons 26–31 put that into practice. Lessons 36–38 build independence.

### Thread 2: The Second Brain

Introduced as a dedicated section (Lessons 21–25), then woven into every practical lesson that follows:

| Lesson | Second Brain Integration |
|--------|------------------------|
| 21–25 | **Dedicated section** — setup, capture, MCP, daily review |
| 26 (Research) | Save research findings to vault; agent pulls from existing notes |
| 27 (Writing) | Draft from vault notes; save polished drafts back |
| 28 (Lesson Planning) | Agent accesses vault for past lesson plans and classroom notes |
| 29 (Organizing) | Full vault organization lesson |
| 30 (Multi-Step) | Workflows that span capture → research → draft → organize |
| 32 (Lesson Planning) | Agent draws on vault for curriculum alignment |
| 38 (What's Next) | Growing and maintaining the Second Brain long-term |

### Thread 3: The Terminal

Karen's primary interface is the CLI (Claude Code, Gemini CLI). The terminal thread keeps things minimal — she should think of iTerm as "the chat room where my agent lives." We use iTerm on macOS.

**Design principle:** If Karen struggles with the terminal, we can build a web GUI that wraps CLI tools in a friendlier interface. So we never go deep on shell mechanics — just enough to be functional.

| Lesson | Terminal Integration |
|--------|---------------------|
| 01 | **Dedicated lesson** — open iTerm, launch `claude`/`gemini`, type and read responses |
| 03 (Git) | SourceTree handles git visually (no terminal git needed yet) |
| 15 (Reading Agent Output) | Reading tool calls and file paths in CLI output |
| 17 (Files & Projects) | Understanding that the terminal is "in" a folder; what `cd` means at a basic level |
| 20 (Sessions) | Starting/stopping sessions; `/clear`, `/help` and other slash commands |
| 26–31 (Workflows) | By now the terminal is natural — just the place where work happens |

### How the Three Threads Connect

The **terminal** is the room Karen walks into. **Agentic AI** is what happens in that room — agents that think, act, and build. The **Second Brain** is what persists after she leaves the room — her knowledge, preferences, and history available to every future session.

Together they solve the "Fresh Mind" problem (Lesson 04): Karen directs capable agents (Thread 1) through a familiar interface (Thread 3), backed by persistent knowledge that bridges every session (Thread 2).

---

## Sequencing Notes

- **Sections 1–2** build foundational AI literacy. Karen should feel confident talking to AI before we introduce agents.
- **Section 3** is the conceptual bridge — understanding *what* agents are and *how* they work.
- **Section 4** is the practical bridge — understanding *her specific* agent setup.
- **Section 5** is the persistence layer — giving agents (and Karen) a shared, lasting memory. This must come before practical workflows so agents have knowledge to draw on.
- **Sections 6–7** are where the payoff happens — Karen uses agents backed by her Second Brain for real work.
- **Section 8** builds independence so Karen continues growing after the curriculum ends.
- Each section's lessons should be completed roughly in order, but Sections 6 and 7 can overlap.
- Lessons 03 and 04 already exist in `curriculum/` (as `02_git_scrapbook` and `03_llm_memory`). Lessons 01–02 should be created to provide the foundation they assumed.

## Dependencies on mem-mem

Section 5 depends on the `mem-mem` system being functional. Build order alignment:

| Lesson | Requires from mem-mem |
|--------|----------------------|
| 21 (What Is a Second Brain?) | Nothing — conceptual |
| 22 (Your Obsidian Vault) | Obsidian installed and vault created |
| 23 (Capturing Thoughts) | Slack capture channel + Supabase ingest pipeline |
| 24 (How Agents Remember You) | MCP server deployed and connected to agents |
| 25 (The Daily Review) | Session log harvester + review UI |

Lessons 21–22 can be taught before mem-mem is fully built. Lessons 23–25 require progressive implementation.
