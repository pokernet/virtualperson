# Implementation Plan - Chat Persistence & Local AI Support

Enable long-term memory for AI personas by persisting messages to Supabase and allow users to leverage local AI models for privacy and cost-efficiency.

## Proposed Changes

### [Database & API Layer]

#### [MODIFY] [route.ts](file:///C:/Users/poker/.gemini/antigravity/scratch/eternity-ai/src/app/api/chat/route.ts)
- Update `resolveAiModel` to use a configurable `LOCAL_AI_URL`.
- Implement logic to save user and assistant messages to the Supabase `messages` table.

---

### [Frontend Components]

#### [MODIFY] [ChatInterface.tsx](file:///C:/Users/poker/.gemini/antigravity/scratch/eternity-ai/src/components/ChatInterface.tsx)
- Add logic to fetch initial chat history from Supabase on component mount.
- Ensure the `useChat` hook is seeded with this historical data.

---

### [Environment Configuration]

#### [MODIFY] [.env.local](file:///C:/Users/poker/.gemini/antigravity/scratch/eternity-ai/.env.local)
- Add `LOCAL_AI_URL` and `AI_MODEL_PREFERENCE` (defaults to `openai`).

## Verification Plan

### Automated Tests
- N/A (Manual verification via browser tool preferred for this UI-heavy app).

### Manual Verification
1. **Chat Persistence**:
   - Open a persona chat.
   - Send several messages.
   - Refresh the page and verify messages are still there.
2. **Local AI**:
   - Set `AI_MODEL_PREFERENCE=local` and `LOCAL_AI_URL` to a mock or real local endpoint.
   - Verify `src/app/api/chat/route.ts` correctly routes requests.
