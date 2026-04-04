# PromptBridge: Advanced AI Middleware Intelligence Log 🪵

This document tracks the features, architecture, and milestones of the PromptBridge project. Use this for presentations or architectural deep-dives.

---

## 🛠️ Phase 1 (Foundation): Input-Output Middleware
- **[Feature] Input Analysis Core**: 
  - Regex & Keyword based entity extractor (Intent, Domain, Tone).
  - Handles explanation, debugging, refinement, and generation.
- **[Feature] Multi-Stage Pipeline**: 
  - Sequential processing: Draft → Refined (Domain Awareness) → Polished (Tone Constraint) → Formatted.
- **[Feature] LLM Abstraction**: 
  - Unified format for ChatGPT, Claude, and Gemini interfaces.
- **[Extension] UI Injection**: 
  - Dynamic button injection into the DOM of ChatGPT, Claude, and Gemini.
  - Asynchronous bridge between extension and local Middleware API (8001).

---

## 🔥 Phase 2 (Intelligence): Evaluation & Self-Correction
- **[Feature] Critic Agent (Evaluation Layer)**: 
  - Rule-based scoring: Clarity, Length, Evidence of Examples, Tone Matching.
  - Returns a structured evaluation JSON.
- **[Feature] Fixer Agent (Correction Loop)**: 
  - Automated recursive generation loop if Evaluation Score < 0.7.
  - Injecting specific "Fixer Instructions" back into the generator chain.
- **[UI] Intelligent Status Badge**: 
  - Visual indicators for "Optimized", "Refined", or "Fixed" states in the browser.

---

## 🌲 Technical Specification
- **Engine**: Groq (Llama-3-70B)
- **Framework**: FastAPI (Python) & Vite (React)
- **Extension**: Manifest V3 (Chrome Spec)
- **Port Strategy**: 
  - **8001**: Middleware API
  - **5173**: Dashboards & Analytics

---

## 🚀 Upcoming Milestones (Phase 3+)
- **Template Retrieval (Vector DB)**: Switching from static templates to similarity-based search using ChromaDB.
- **Output Enhancement Mode**: Selecting existing LLM outputs and "re-routing" them through the Fixer Agent.
- **Detailed Analytics Dashboard**: Visualizing prompt evolution over time.

---

© 2026 PromptBridge Middleware Engine - Built by Antigravity
