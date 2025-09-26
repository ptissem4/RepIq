import { GoogleGenAI, Chat, Type } from "@google/genai";
import { ChatMessage, MessageSender, Feedback, GeneratedResponse, ActionPlanItem, Scenario } from "../types";
import { Language } from '../contexts/LanguageContext';

// FIX: Use process.env.API_KEY as per the guidelines, instead of import.meta.env.
// Ensure API_KEY is set in the environment
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = (systemInstruction: string): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
};

export const generateFeedback = async (chatHistory: ChatMessage[], language: Language): Promise<Feedback | null> => {
  const transcript = chatHistory
    .map((msg, index) => `[${index}] ${msg.sender === MessageSender.USER ? 'Closer' : 'Prospect'}: ${msg.text}`)
    .join('\n');
  
  const closerMessages = chatHistory.filter(msg => msg.sender === MessageSender.USER);
  const prospectMessages = chatHistory.filter(msg => msg.sender === MessageSender.AI);

  const closerWordCount = closerMessages.reduce((acc, msg) => acc + msg.text.split(' ').length, 0);
  const prospectWordCount = prospectMessages.reduce((acc, msg) => acc + msg.text.split(' ').length, 0);
  const totalWordCount = closerWordCount + prospectWordCount;
  
  const talkToListenRatio = {
      user: totalWordCount > 0 ? Math.round((closerWordCount / totalWordCount) * 100) : 50,
      prospect: totalWordCount > 0 ? Math.round((prospectWordCount / totalWordCount) * 100) : 50,
  };

  // Assuming an average speaking rate for estimation, roughly 15 seconds per turn (user + AI response)
  const estimatedDurationMinutes = (chatHistory.length / 2) * 15 / 60;
  const averageWPM = estimatedDurationMinutes > 0 ? Math.round(closerWordCount / estimatedDurationMinutes) : 140;

  const outputLanguageName = language === 'fr-FR' ? 'French' : 'English';

  const prompt = `You are a world-class sales coach (think a mix of Chris Voss and Jordan Belfort). Analyze the following sales conversation transcript with extreme precision.
Each line is prefixed with its message index (e.g., '[0]', '[1]').

Analyze the 'Closer's performance based on the entire conversation.

IMPORTANT: You MUST provide your entire analysis (summary, strengths, areasForImprovement, contextualFeedback comments) in ${outputLanguageName}.

Provide a concise, critical, and actionable feedback report in the specified JSON format.
- **overallScore**: Rate the Closer's overall performance on a scale of 1 to 100.
- **pacingWPM**: Calculate the Closer's average pacing in words per minute (WPM). A typical conversational pace is 140-160 WPM. Use the provided average WPM of ${averageWPM} as a baseline.
- **clarityScore**: Rate the clarity of the Closer's language on a scale of 1 to 100.
- **inferredTonality**: Infer the Closer's primary tonality (e.g., 'Confident', 'Hesitant', 'Empathetic', 'Assertive', 'Neutral').
- **strengths**: Identify 3 key strengths.
- **areasForImprovement**: Identify 3 key areas for improvement.
- **summary**: A concise overall summary and a key takeaway.
- **contextualFeedback**: Provide specific feedback on individual messages. Focus on the most impactful moments.
- **talkToListenRatio**: This is already calculated for you. Use these values: ${JSON.stringify(talkToListenRatio)}.
- **discourseStructure**: Analyze the conversation's structure. Rate the effectiveness of the 'opening' (how they started), 'discoveryQuestions' (if they asked good, open-ended questions), and 'callToActionStrength' (how strong their closing or next steps were) on a scale of 0-100.
- **skillScores**: Analyze and rate the Closer's performance on these specific sales skills on a scale of 0-100: 'rapportBuilding', 'objectionHandling', and 'closing'.

Transcript:
${transcript}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.INTEGER },
            pacingWPM: { type: Type.INTEGER },
            clarityScore: { type: Type.INTEGER },
            inferredTonality: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
            contextualFeedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  messageIndex: { type: Type.INTEGER },
                  comment: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ["messageIndex", "comment", "type"],
              },
            },
            talkToListenRatio: {
              type: Type.OBJECT,
              properties: {
                user: { type: Type.INTEGER },
                prospect: { type: Type.INTEGER },
              },
              required: ["user", "prospect"],
            },
            discourseStructure: {
              type: Type.OBJECT,
              properties: {
                openingEffectiveness: { type: Type.INTEGER },
                discoveryQuestions: { type: Type.INTEGER },
                callToActionStrength: { type: Type.INTEGER },
              },
              required: ["openingEffectiveness", "discoveryQuestions", "callToActionStrength"],
            },
            skillScores: {
              type: Type.OBJECT,
              properties: {
                rapportBuilding: { type: Type.INTEGER },
                objectionHandling: { type: Type.INTEGER },
                closing: { type: Type.INTEGER },
              },
              required: ["rapportBuilding", "objectionHandling", "closing"],
            },
          },
          required: [
            "overallScore", "pacingWPM", "clarityScore", "inferredTonality",
            "strengths", "areasForImprovement", "summary", "contextualFeedback",
            "talkToListenRatio", "discourseStructure", "skillScores"
          ],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedFeedback = JSON.parse(jsonText);
    return parsedFeedback as Feedback;
  } catch (error) {
    console.error("Error generating feedback:", error);
    return null;
  }
};


export const generateActionPlan = async (feedback: Feedback, scenarios: Scenario[], language: Language): Promise<ActionPlanItem[] | null> => {
  const scenarioList = scenarios.map(s => `- ${s.title} (ID: ${s.id})`).join('\n');
  const outputLanguageName = language === 'fr-FR' ? 'French' : 'English';
  
  const prompt = `You are an AI Sales Coach. Based on the following feedback report, generate a personalized 2-step action plan to help the user improve.
  
  IMPORTANT: The 'suggestion' for each step MUST be in ${outputLanguageName}.
  
  Feedback Report:
  - Summary: ${feedback.summary}
  - Areas for Improvement: ${feedback.areasForImprovement.join(', ')}
  - Lowest Skill Score: Identify the skill with the lowest score from these: Rapport Building (${feedback.skillScores.rapportBuilding}), Objection Handling (${feedback.skillScores.objectionHandling}), Closing (${feedback.skillScores.closing}).

  For each step in the plan:
  1. Provide a concise, actionable suggestion for the user.
  2. From the list of available scenarios below, choose the ONE scenario that is MOST relevant for practicing that specific step.
  3. You MUST include the exact ID of the chosen scenario.

  Available Scenarios:
  ${scenarioList}

  Return the plan in the specified JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              suggestion: {
                type: Type.STRING,
                description: "The actionable suggestion for the user."
              },
              relevantScenarioId: {
                type: Type.STRING,
                description: "The exact ID of the most relevant scenario from the list."
              }
            },
            required: ["suggestion", "relevantScenarioId"]
          }
        },
      },
    });
    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText);
    return parsedPlan as ActionPlanItem[];
  } catch (error) {
    console.error("Error generating action plan:", error);
    return null;
  }
};


export const generateLiveResponse = async (prospectTranscript: string): Promise<GeneratedResponse | null> => {
  if (!prospectTranscript.trim()) {
    return null;
  }

  const prompt = `You are an elite AI sales closer. A prospect just said the following:
---
"${prospectTranscript}"
---
Your task is to generate the single best, complete, and natural-sounding response to say back to them. The response should be ready to be read aloud immediately. Do not add any commentary, preamble, or explanation. Provide only the response text.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // This is critical for speed
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            response: {
              type: Type.STRING,
              description: "The single, complete response for the salesperson to say.",
            },
          },
          required: ["response"],
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    return parsedResponse as GeneratedResponse;
  } catch (error) {
    console.error("Error generating live response:", error);
    return null;
  }
};