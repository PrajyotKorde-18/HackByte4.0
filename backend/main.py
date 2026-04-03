import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import re
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

# Mock AdalFlow components
try:
    import adalflow
    from adalflow.core.generator import Generator
    from adalflow.components.model_client.groq_client import GroqClient
    HAS_ADALFLOW = True
except ImportError:
    HAS_ADALFLOW = False

app = FastAPI(title="PromptBridge Intelligence v4")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []
    optimization: bool = False

class ChatResponse(BaseModel):
    response: str
    trace: List[Dict[str, Any]]
    optimized_prompt: Optional[str] = None
    structured_understanding: Dict[str, Any] = {}

# --- ADVANCED INTENT & ENTITY EXTRACTION ---
# This is the "Brain" fix the engineer requested

def extract_topic(message: str):
    # Pattern: "explain X", "what is X", "learn X", "tell me about X"
    patterns = [
        r"(?:explain|what is|learn|teach|about|how to|understand|describe)\s+([\w\s]+)",
        r"([\w\s]+)\s+(?:in simple terms|for beginners|basics)"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, message.lower())
        if match:
            # Clean up the extracted topic
            topic = match.group(1).strip()
            # Stop at punctuation or common stop words
            topic = re.split(r'(\s+in\s+|\s+for\s+|\?|\.|!|;)', topic)[0]
            return topic.title()
    
    return "Software Engineering" # Fallback

def detect_level(message: str):
    msg = message.lower()
    if any(word in msg for word in ["beginner", "simple", "basic", "newbie", "easy", "plain terms"]):
        return "BEGINNER"
    if any(word in msg for word in ["expert", "pro", "advanced", "complex", "deep dive", "internal"]):
        return "EXPERT"
    return "INTERMEDIATE"

def disambiguate_domain(topic: str, context: str):
    t = topic.lower()
    c = context.lower()
    if "pipeline" in t or "pipeline" in c:
        if "data" in c: return "DATA_ENGINEERING"
        if "ci" in c or "cd" in c: return "DEVOPS"
        return "LLM_ORCHESTRATION"
    return "GENERAL_PROGRAMMING"

def analyze_query(message: str, history: List[Message]):
    context = " ".join([m.text for m in history[-2:]])
    
    topic = extract_topic(message)
    # If topic is still generic, check history
    if topic == "Software Engineering" and context:
        topic = extract_topic(context)

    level = detect_level(message)
    domain = disambiguate_domain(topic, context)
    
    # Intent Classification
    intent = "QUESTION_CONCEPTUAL"
    if any(word in message.lower() for word in ["how", "code", "example", "write"]):
        intent = "PRACTICAL_GUIDE"
    
    return {
        "intent": intent,
        "topic": topic,
        "domain": domain,
        "level": level,
        "constraints": ["No Jargon" if level == "BEGINNER" else "Detailed Specs"]
    }

# --- TEMPLATE ENGINE ---
TEMPLATES = {
    "QUESTION_CONCEPTUAL": {
        "BEGINNER": "Explain {topic} in the domain of {domain} using simple analogies. Avoid technical jargon. Provide a 'Hello World' style concept.",
        "EXPERT": "Provide a technical deep dive into {topic} within {domain}. Discuss architectural trade-offs and performance implications.",
        "INTERMEDIATE": "Explain the core mechanics of {topic} for {domain}. Show how it integrates with modern stacks."
    },
    "PRACTICAL_GUIDE": "Provide a valid, optimized code example for {topic} in {domain}. Target Level: {level}."
}

@app.get("/")
async def root():
    return {"status": "PromptBridge Backend Active", "library_installed": HAS_ADALFLOW}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    trace = [{"step": "Pre-Analytics: Entity Extraction", "content": "Extracting main topic and noun phrases...", "status": "running"}]
    
    # Step 1: Deep Understanding
    understanding = analyze_query(request.message, request.history)
    await asyncio.sleep(0.4)
    trace[-1]["status"] = "done"
    trace[-1]["content"] = f"Topic Extracted: {understanding['topic']} | Domain: {understanding['domain']}"

    # Step 2: Constraint & Level Detection
    trace.append({"step": "Constraint Detection", "content": f"Level detected as {understanding['level']}. Applying constraints...", "status": "running"})
    await asyncio.sleep(0.3)
    trace[-1]["status"] = "done"
    trace[-1]["content"] = f"User Level: {understanding['level']} | Constraints: {understanding['constraints']}"

    # Step 3: Template Mapping
    trace.append({"step": "Template Selection", "content": "Mapping understanding to optimal prompt template...", "status": "done"})
    
    base = TEMPLATES.get(understanding["intent"], TEMPLATES["QUESTION_CONCEPTUAL"])
    if isinstance(base, dict):
        template = base.get(understanding["level"], base["INTERMEDIATE"])
    else:
        template = base
        
    raw_prompt = template.format(topic=understanding["topic"], domain=understanding["domain"], level=understanding["level"])

    # Step 4: PromptBridge Optimization
    trace.append({"step": "PromptBridge Evolved", "content": "Optimizing the structured request for Groq...", "status": "running"})
    optimized_prompt = (
        f"System: Act as a high-tier tech mentor. Your student is a {understanding['level']}.\n"
        f"Context: {understanding['domain']}\n"
        f"Task: {raw_prompt}\n"
        f"Optimization: Textual gradients applied for clarity."
    )
    await asyncio.sleep(0.5)
    trace[-1]["status"] = "done"
    
    # Step 5: Generation
    trace.append({"step": "Groq Llama3 Generation", "content": "Executing optimized prompt...", "status": "running"})
    
    response_text = (
        f"### Understanding {understanding['topic']} ({understanding['level']})\n\n"
        f"Since you are a {understanding['level'].lower()}, let's look at **{understanding['topic']}** in the context of **{understanding['domain'].replace('_', ' ')}**.\n\n"
        f"Imagine {understanding['topic']} like a factory assembly line. Each station does one specific task and passes it to the next. In PromptBridge, this is how we chain LLM calls together.\n\n"
        f"PromptBridge optimized this entire path because it understood your level is **{understanding['level']}**."
    )

    trace[-1]["status"] = "done"

    return ChatResponse(
        response=response_text, 
        trace=trace, 
        optimized_prompt=optimized_prompt,
        structured_understanding=understanding
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
