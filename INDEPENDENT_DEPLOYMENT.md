# Spritemals outside Lovable

This branch runs as a normal TanStack Start application. The existing Lovable site stays online while the new deployment is tested.

## Local development

Requires Node.js 22 or newer. Run `npm install`, then `npm run dev`. For a production check run `npm run build` and `npm start`.

## Deployment

Import this repository and the `codex/independent-app` branch in Netlify. This project includes the Netlify plugin and `netlify.toml`; build command is `npm run build`, publish directory is `dist/client`. Netlify Free permits commercial projects within its limits.

Set `OPENAI_API_KEY` and a long random `SPRITEMALS_DEMO_CODE` in the hosting dashboard as **server-only** environment variables. Never place either in the repository or in a `VITE_` variable. The demo code gates image requests to control costs; this is a private demo, not a customer login system. Live generation will return a setup message until these values are set. OpenAI API usage is billed separately from hosting.

The saved companions currently live in the visitor's browser. They will not sync between devices. Shop cards are concepts with placeholder prices; checkout and manufacturing are not connected.

After the new URL is ready, set `SPRITEMALS_PUBLIC_URL` to that origin and redeploy. Keep the Lovable URL until the replacement is verified on a phone and desktop.
