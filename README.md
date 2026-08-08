<div align="center">
  <img src="https://img.shields.io/badge/AgentCut-Lite-ef7438?style=for-the-badge&logo=next.js&logoColor=white" alt="AgentCut Lite Logo" />
  <br/>
  <h1>🎬 AgentCut Lite</h1>
  <p><strong>A Next-Generation, AI-Powered Video Editing Agent</strong></p>

  <p>
    <a href="#-why-this-project">Why</a> •
    <a href="#-the-idea">The Idea</a> •
    <a href="#%EF%B8%8F-features">Features</a> •
    <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
    <a href="#-architecture--system-design">Architecture</a> •
    <a href="#-how-to-use">Usage</a> 
  </p>
</div>

---

## 🚀 Why This Project?
Video editing has historically been a manual, tedious, and highly technical process. Learning curves for professional software (Premiere, After Effects, DaVinci) are incredibly steep. **AgentCut Lite** was built to democratize video editing by introducing an intelligent, natural-language interface. Why click through a dozen menus to add a subtitle when you can simply type, *"Add a red title saying 'Subscribe' at 2s"*?

This project bridges the gap between **creative intent** and **technical execution**, proving that LLMs can act as fully autonomous agents within complex visual mediums.

## 💡 The Idea
The core idea is simple but revolutionary: **Combine modern web-based video rendering with state-of-the-art AI Function Calling.**

We treat the video timeline not just as visual state, but as JSON state. By equipping an LLM with highly specific "tools" (like adding clips, applying filters, modifying audio), the AI acts as your personal editor. You describe the vision; the AI calculates the frames, adjusts the CSS/Remotion properties, and updates the state instantly.

## ⚙️ Features
- **🗣️ Natural Language Editing:** Type your edits in plain English. No complex timelines required.
- **⚡ Instant Rendering:** Powered by Remotion, changes to the timeline are reflected in the video player instantaneously.
- **🛠️ AI Tool Calling:** The AI autonomously executes client-side tools (e.g., `addTextClip`, `applyFilter`) based on contextual understanding.
- **📐 Frame-Accurate Precision:** The LLM mathematically computes start times, durations, and layer placements (e.g., "at 2 seconds" automatically converts to frame 60 at 30fps).
- **🎨 Dynamic State Management:** Leveraging Zustand, the entire video timeline is a reactive, predictable state tree.

## 🛠️ Tech Stack
This project leverages the absolute bleeding edge of the JavaScript/TypeScript ecosystem:

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/) & React 19
*   **Video Engine:** [Remotion v4](https://www.remotion.dev/)
*   **AI Integration:** [Vercel AI SDK v7](https://sdk.vercel.ai/docs)
*   **LLM Provider:** [Groq (Llama-3.3-70b-versatile)](https://groq.com/) for lightning-fast inference
*   **State Management:** [Zustand v5](https://zustand-demo.pmnd.rs/)
*   **Styling:** Tailwind CSS v4 & Framer Motion
*   **Icons:** Lucide React

## 🏛 Architecture & System Design

### 1. The Timeline State (Zustand)
The entire video is represented as an array of clip objects in a Zustand store. A clip contains properties like `id`, `type`, `startFrame`, `durationInFrames`, `text`, `color`, and `filter`. Remotion reads directly from this store to compose the `<Composition />`.

### 2. The AI Agent Pipeline (Vercel AI SDK)
1. **User Prompt:** The user types an instruction in the UI (e.g., "Make it black and white").
2. **Client `useChat`:** The `@ai-sdk/react` hook intercepts the message and streams it to the Next.js API route.
3. **Server Validation:** The API route (`/api/chat`) formats the message for the Groq LLM and defines a strict Zod `inputSchema` for available tools.
4. **LLM Decision:** Groq interprets the request and triggers a tool call (e.g., `applyFilter({ filter: "grayscale(100%)" })`).
5. **Client-Side Execution:** The API streams the tool call back to the browser. The `Chat.tsx` component intercepts the `tool-call`, extracts the arguments, and dispatches the update to the Zustand store.
6. **Confirmation:** The client sends an `addToolResult` (acknowledgment) back to the LLM, and the AI responds with a friendly confirmation message to the user.

### 3. Rendering (Remotion)
The `<Player />` component subscribes to the Zustand store. Whenever the AI modifies the state, Remotion immediately re-evaluates the active frames and updates the canvas natively in the browser without requiring a heavy backend video rendering pass.

## 💻 How To Use

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aditya-s45/AgentCut-Lite.git
   cd AgentCut-Lite
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start interacting with your AI video editor!

## 📚 Resources
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Remotion Documentation](https://www.remotion.dev/docs)
- [Groq Cloud Console](https://console.groq.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---
<div align="center">
  <i>Built with ❤️ pushing the boundaries of AI & Video</i>
</div>
