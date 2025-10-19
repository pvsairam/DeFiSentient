import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "openai" | "gemini" | "claude" | "deepseek";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIStreamHandler {
  onIntermediate?: (type: string, message: string) => void;
  onComplete: (response: string) => void;
  onError: (error: Error) => void;
}

export class AIProviderService {
  async streamCompletion(
    provider: AIProvider,
    apiKey: string,
    messages: AIMessage[],
    systemPrompt: string,
    handler: AIStreamHandler
  ): Promise<void> {
    try {
      switch (provider) {
        case "openai":
          await this.streamOpenAI(apiKey, messages, systemPrompt, handler);
          break;
        case "gemini":
          await this.streamGemini(apiKey, messages, systemPrompt, handler);
          break;
        case "claude":
          await this.streamClaude(apiKey, messages, systemPrompt, handler);
          break;
        case "deepseek":
          await this.streamDeepSeek(apiKey, messages, systemPrompt, handler);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${provider}`);
      }
    } catch (error: any) {
      handler.onError(error);
    }
  }

  private async streamOpenAI(
    apiKey: string,
    messages: AIMessage[],
    systemPrompt: string,
    handler: AIStreamHandler
  ): Promise<void> {
    const openai = new OpenAI({ apiKey });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    handler.onComplete(fullResponse);
  }

  private async streamGemini(
    apiKey: string,
    messages: AIMessage[],
    systemPrompt: string,
    handler: AIStreamHandler
  ): Promise<void> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];
    
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    
    handler.onComplete(response.text());
  }

  private async streamClaude(
    apiKey: string,
    messages: AIMessage[],
    systemPrompt: string,
    handler: AIStreamHandler
  ): Promise<void> {
    const anthropic = new Anthropic({ apiKey });

    const stream = await anthropic.messages.stream({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      })),
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        fullResponse += chunk.delta.text;
      }
    }

    handler.onComplete(fullResponse);
  }

  private async streamDeepSeek(
    apiKey: string,
    messages: AIMessage[],
    systemPrompt: string,
    handler: AIStreamHandler
  ): Promise<void> {
    // DeepSeek uses OpenAI-compatible API
    const deepseek = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    });

    const stream = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg) => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content,
        })),
      ],
      stream: true,
      temperature: 0.7,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
    }

    handler.onComplete(fullResponse);
  }
}

export const aiProviderService = new AIProviderService();
