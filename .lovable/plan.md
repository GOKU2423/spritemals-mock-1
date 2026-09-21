# SPRITEMALS — Interactive Creation Studio Upgrade

## Goal
Turn the existing Create journey into a tactile, believable design-and-adoption experience while preserving the current Companion Form artwork, cosmic visual language, guides, navigation, shop, and prototype-only positioning.

## Experience changes
- Rebuild photo intake as a mobile-friendly workflow with a large preview area, separate Choose Photo and Take Photo controls, replacement, helpful photography guidance, and clear advancement. Selected photos stay local to the browser.
- Expand creation into a timed multi-stage transformation with changing status text, progress, scanning and energy effects, followed by a deliberate Companion Form reveal. Add a clearly locked Mini Form teaser.
- Replace the simple option grid with a live studio: prominent creature stage, seven touch-friendly control categories, visible cosmetic/aura/accessory feedback, selected-state summaries, optional completion progress, and trait locks.
- Add Undo, Redo, Randomize, Reset, and Before/After controls. Randomize will preserve locked traits.
- Expand naming into a personal profile editor with multiple personality traits and an editable greeting, all reflected live in the companion card.
- Make saving trigger an adoption celebration and a finished character card with three working paths: companion room, plush concept, and product collection.
- Persist the saved Spritemal and its selected details in browser storage so My Spritemals, Companion, and Shop continue to recognize it after navigation or refresh.

## Technical details
- Keep this entirely front-end and prototype-only; use object URLs for local photo previews and browser storage for persistence.
- Model customization as typed state with history snapshots, lock state, category metadata, and deterministic visual overlays on the existing creature image.
- Keep the current five-stage journey, but add internal transformation/reveal and saved celebration states rather than introducing unrelated pages.
- Extend semantic design tokens and reusable animations only where needed; preserve reduced-motion behavior.
- Keep all existing product prices exactly `$—` and avoid any production AI, checkout, manufacturing, or paid-service claims.

## Verification
- Test choose/replace photo, generation statuses and reveal, customization changes, locking/randomization, undo/redo/reset, before/after, naming/profile updates, save celebration, all three next actions, and persistence after refresh.
- Check mobile and desktop layouts for visible controls, stable stage sizing, and no console errors.
