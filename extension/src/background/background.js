// background.js for PromptBridge
console.log("PromptBridge: Service Worker Active");

// To be used for cross-site fetching or heavy tasks if needed in the future
chrome.runtime.onInstalled.addListener(() => {
  console.log("PromptBridge: Installed Successfully");
});
