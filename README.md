# PromptBridge

**Turns a rough, vague prompt into a clear one that gets better answers from an LLM.**

Most people type a half-formed prompt and get a half-useful answer. PromptBridge sits between the user and the model: it works out what the user is actually trying to do, then rewrites the prompt to match. We built it in a team of four at **HackByte 4.0** (IIITDM Jabalpur), where we were among the Top 120 teams in India.

<!-- Add a demo GIF or screenshot here: docs/demo.gif -->

---

## What it does

- Detects the intent behind a user's prompt
- Refines the prompt using an LLM (Llama-3-70B on Groq)
- Saves sessions and prompt history so users can go back to earlier versions

**Built with:** FastAPI, React, PostgreSQL, Groq (Llama-3-70B)

## How it's built

| Part | What it does |
|---|---|
| **React frontend** | Where the user enters a prompt and sees the refined result |
| **FastAPI backend** | Receives requests and coordinates the steps below |
| **Intent detection engine** | Works out what the user is trying to achieve |
| **Refinement pipeline** | Sends the prompt and detected intent to Llama-3-70B on Groq and returns an improved prompt |
| **PostgreSQL** | Stores sessions and prompt history |

<!-- Add an architecture diagram here: docs/architecture.png -->

## My role

I designed the system architecture and owned the PostgreSQL database design, including connecting the backend to it for session and prompt-history storage. I also helped integrate everything into one working demo. My teammates built the intent-detection engine and the prompt-refinement pipeline.

## Run it locally

You'll need Python 3.10+, Node.js 18+, PostgreSQL and a Groq API key.

```bash
git clone https://github.com/PrajyotKorde-18/HackByte4.0.git
cd HackByte4.0
```

**Backend**

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file:

```
GROQ_API_KEY=your_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/promptbridge
```

```bash
uvicorn main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## What I learned

- Designing the data model early made it much easier for four people to build separate parts that still fit together
- Integration at a hackathon is where things break, so agreeing on API shapes up front saves hours
- Working with a team under a deadline means splitting ownership clearly

## Team

Built at HackByte 4.0 by a team of four.

- **Prajyot Korde**: architecture and database design ([GitHub](https://github.com/PrajyotKorde-18))
- Teammates: add their names and GitHub links here

## Author

**Prajyot Korde**, IT undergrad at Ramdeobaba University
[LinkedIn](https://www.linkedin.com/in/prajyot-korde-912621281) · [GitHub](https://github.com/PrajyotKorde-18)
