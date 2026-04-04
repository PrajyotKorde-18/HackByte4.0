console.log("PromptBridge: Content Script Injected");

const injectUI = () => {
  const targetHost = window.location.hostname;
  let inputArea = null;

  if (targetHost.includes("chatgpt.com")) {
    inputArea = document.querySelector("#prompt-textarea") || document.querySelector("textarea");
  } else if (targetHost.includes("claude.ai")) {
    inputArea = document.querySelector("[contenteditable='true']");
  } else if (targetHost.includes("gemini.google.com")) {
    inputArea = document.querySelector(".textarea") || document.querySelector("textarea");
  }

  if (inputArea && !document.getElementById("pb-optimizer-btn")) {
    const btn = document.createElement("button");
    btn.id = "pb-optimizer-btn";
    btn.innerText = "✨ Optimize Prompt";
    btn.style.cssText = "background: #8b5cf6; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin: 4px; cursor: pointer; font-size: 12px; font-weight: bold; z-index: 10000; position: relative;";
    
    btn.onclick = async (e) => {
      e.preventDefault();
      const originalText = inputArea.value || inputArea.innerText;
      if (!originalText) return;

      btn.innerText = "⏳ Optimizing...";
      try {
        const response = await fetch("http://localhost:8001/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            input_text: originalText, 
            target_provider: targetHost 
          })
        });
        const data = await response.json();
        
        // Update the input area
        if (inputArea.tagName === "TEXTAREA" || inputArea.tagName === "INPUT") {
          inputArea.value = data.final_output;
        } else {
          inputArea.innerText = data.final_output;
        }
        
        btn.innerText = "✅ Optimized!";
        setTimeout(() => btn.innerText = "✨ Optimize Prompt", 2000);
      } catch (err) {
        console.error("PromptBridge Error:", err);
        btn.innerText = "❌ Error (Is Backend Up?)";
      }
    };

    // Append near the input area
    inputArea.parentElement.appendChild(btn);
  }
};

// Polling for UI changes (SPA navigation)
setInterval(injectUI, 2000);
