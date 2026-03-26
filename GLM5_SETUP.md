# GLM-5 Model Integration

## Overview

Aura now supports **GLM-5** (Zhipu AI's GLM-5 model) via OpenRouter, in addition to Google's Gemini models.

## Setup

### 1. Get an OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy your API key

### 2. Add Environment Variable

Add the following to your `.env` file (or Railway environment variables):

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Use GLM-5 in API Calls

When making chat requests, specify the model parameter:

```javascript
// Playground or API request
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Hello, how can you help me?",
    conversationId: "optional-conversation-id",
    agentId: "your-agent-id",
    language: "en",
    model: "glm5"  // 👈 Use GLM-5 model
  })
});
```

## Supported Models

| Model Value | AI Model | Provider |
|-------------|----------|----------|
| `gemini` (default) | Gemini 2.0 Flash | Google |
| `glm5` or `glm-5` | GLM-5 | Zhipu AI (via OpenRouter) |

## Model Comparison

### Gemini 2.0 Flash
- ✅ Fast response times
- ✅ Excellent multilingual support
- ✅ Good for general-purpose chat
- 💰 Free tier available

### GLM-5
- ✅ Strong reasoning capabilities
- ✅ Excellent for Chinese language tasks
- ✅ Good code generation
- ✅ Balanced performance
- 💰 Pay-per-use via OpenRouter

## Usage Examples

### Default (Gemini)
```json
{
  "message": "What are your business hours?",
  "agentId": "demo-agent-001"
}
```

### With GLM-5
```json
{
  "message": "What are your business hours?",
  "agentId": "demo-agent-001",
  "model": "glm5"
}
```

### With Language Support
```json
{
  "message": "你们的营业时间是什么?",
  "agentId": "demo-agent-001",
  "model": "glm5",
  "language": "zh"
}
```

## Adding More Models

To add additional OpenRouter models, update `server/routes.ts`:

```typescript
else if (model === "your-model-name") {
  const completion = await openrouter.chat.completions.create({
    model: "provider/model-name",  // OpenRouter model ID
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
  });
  baseResponse = completion.choices[0]?.message?.content || "Error";
}
```

## OpenRouter Model IDs

Some popular models available on OpenRouter:

- `zhipu-ai/glm-5` - GLM-5
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `meta-llama/llama-3.3-70b-instruct` - Llama 3.3 70B
- `google/gemini-2.0-flash-thinking-exp` - Gemini 2.0 Flash Thinking

See [OpenRouter Models](https://openrouter.ai/models) for the full list.

## Troubleshooting

### "I'm having trouble connecting to my AI service"

1. Check that `OPENROUTER_API_KEY` is set correctly
2. Verify your OpenRouter account has credits
3. Check the model ID is correct: `zhipu-ai/glm-5`

### Rate Limits

OpenRouter has rate limits per model. If you hit a limit:
- Wait a few seconds and retry
- Upgrade your OpenRouter plan
- Switch to a different model temporarily

### Cost Monitoring

Track your OpenRouter usage at:
https://openrouter.ai/activity

## Railway Deployment

To deploy with GLM-5 support on Railway:

1. Go to your Railway project
2. Navigate to **Variables** tab
3. Add: `OPENROUTER_API_KEY` = `your_key_here`
4. Railway will auto-redeploy

## Security

⚠️ **Never commit API keys to Git**

- Use `.env` for local development
- Use Railway environment variables for production
- Add `.env` to `.gitignore` (already done)

## Support

For issues with:
- **GLM-5 model**: Check [OpenRouter docs](https://openrouter.ai/docs)
- **Aura platform**: Contact support@aura.ai
