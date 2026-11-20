# Design Principles
1. Seek the elegant solution before implementing the obvious one.
2. Reduce complexity instead of relocating it.
3. One concept, one implementation, one source of truth.
4. Eliminate special cases through better design.
5. Prefer generic mechanisms over repeated code.
6. Keep related logic together.
7. Every abstraction must simplify the system.
8. APIs should be orthogonal and composable.
9. Optimize hot paths without compromising the design.
10. Comments explain rationale and trade-offs, never restate the code.
11. Delete obsolete code instead of preserving history.
12. Continuously improve the architecture while implementing changes.

# Implementation Discipline
1. Make behavior deterministic. Do not add speculative fallbacks or defensive
   branches that hide a broken contract; 
2. Treat every state flag as a design cost. Before adding one, check whether
   the state can be derived from an existing object, relationship, or API.
3. Verify event payloads and client API contracts instead of guessing.
4. don't do frontend inspection (playwright/screenshoting etc) unless required

# About comments in code
don't write verbose comments!
don't write verbose comments!
don't write verbose comments!
don't write verbose comments!
only explain unormal 'why', when really necessary, readers are not ideats, when really necessary, when really necessary, not 'what' or 'how'.

# path
plans should be put to this project: ./.agent/plans/

# skills
./.agent/skills

# We're in dev stage
For code:
no backward compat needed. don't worry about breaking changes, just make sure the code is clean and simple, and the design is elegant.
For db:
write migrations that run once after schema update, or confirm with the user whether to just drop db and re-seed.