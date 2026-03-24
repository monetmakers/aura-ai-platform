// Quick debug script to test API endpoints
import fetch from 'node-fetch';

const API_URL = "https://aura-ai-platform.up.railway.app"; // Replace with your actual Railway URL

async function testAPI() {
  console.log("🔍 Testing Aura API...\n");

  // Test 1: Check if server is running
  try {
    const response = await fetch(`${API_URL}/api/health`, { method: "GET" });
    console.log("✅ Server is running");
  } catch (error) {
    console.log("❌ Server not responding:", error.message);
    return;
  }

  // Test 2: Test chat endpoint
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Hello, test message",
        conversationId: "test-conv",
        agentId: "default-agent",
      }),
    });

    const data = await response.json();
    console.log("Chat response:", data);
    
    if (response.ok) {
      console.log("✅ Chat API works!");
    } else {
      console.log("❌ Chat API error:", response.status, data);
    }
  } catch (error) {
    console.log("❌ Chat API failed:", error.message);
  }

  // Test 3: Check environment variables
  console.log("\n📋 Environment Variables:");
  console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "✅ Set" : "❌ Missing");
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing");
  console.log("SESSION_SECRET:", process.env.SESSION_SECRET ? "✅ Set" : "❌ Missing");
}

testAPI();
