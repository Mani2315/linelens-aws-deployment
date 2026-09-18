# LineLens Local

LineLens is a locally running React knowledge assistant that answers support questions using a small set of approved organizational documents. The project was built as a multi-file local-development version of the Workshop 1 prototype.

## Features

- Responsive chat interface for desktop and mobile
- Frontend form validation, loading states, and readable error feedback
- Server-side API route with request validation
- Answers with source citations and confidence labels
- Insufficient-evidence response for unsupported questions
- Human-support handoff confirmation
- Private per-tab persistence through session storage
- Sensitive-data screening, request-size checks, rate limiting, and secure response headers
- Keyboard navigation, screen-reader labels, live status announcements, and a skip link

## Project structure

- `app/page.tsx` assembles the primary user interface
- `app/api/chat/route.ts` validates requests and returns grounded answers
- `components/` contains reusable chat, source, and handoff components
- `hooks/use-persistent-chat.ts` manages saved conversation state
- `lib/knowledge.ts` contains the prototype knowledge sources and response logic

## Run locally

1. Install Node.js 22 or newer.
2. From this project folder, run `npm install`.
3. Start the development server with `npm run dev`.
4. Open the localhost address shown in the terminal, normally `http://localhost:3000`.

## Production build

Run `npm run build` to create a production build.

## AWS App Runner deployment

This repository includes `apprunner.yaml` for a source-code deployment using
the AWS App Runner Node.js 22 runtime. App Runner installs the dependencies,
builds and tests the application, then starts the production Next.js server on
the port supplied through the `PORT` environment variable.

Before pushing to GitHub, verify the same production path locally:

1. Run `npm install`.
2. Run `npm test`.
3. Run `npm run build`.
4. Run `PORT=8080 npm start`.
5. Open `http://localhost:8080` and test the chat workflow.

No API keys or application secrets are required for this educational
prototype. Do not commit `.env` files, AWS credentials, or GitHub tokens.

## Prototype scope

This educational prototype uses a small local knowledge set rather than a production retrieval database or external language model. Production deployment would require authentication, role-based permissions, monitoring, secure data storage, and more extensive evaluation.

## Testing and security

Run `pnpm test` for input validation, sensitive-data screening, answer routing, and rate-limit tests. The server independently validates every request, rejects non-JSON or oversized payloads, avoids caching responses, and returns generic errors that do not expose implementation details. Conversation history is limited to the current browser tab and can be cleared by the user.
