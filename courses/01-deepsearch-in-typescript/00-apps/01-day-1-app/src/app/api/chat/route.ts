import type { Message } from "ai";
import {
  streamText,
  createDataStreamResponse,
} from "ai";
import { z } from "zod";
import { auth } from "~/server/auth";
import { model } from "~/models";
import { searchSerper } from "~/serper";

export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as {
    messages: Array<Message>;
  };

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const { messages } = body;

      const result = streamText({
        model,
        messages,
        system: `You are a helpful AI assistant that can search the web to provide accurate, up-to-date information. When users ask questions, you should use the search web tool to find current information and cite your sources using markdown link format [title](url). Always format links in markdown and try to include at least one reference if you use search results. Always attempt to search for relevant information to provide the most helpful and accurate response possible.`,
        maxSteps: 10,
        tools: {
          searchWeb: {
            parameters: z.object({
              query: z.string().describe("The query to search the web for"),
            }),
            execute: async ({ query }, { abortSignal }) => {
              console.log(`🔍 Web search executed with query: "${query}"`);
              
              const results = await searchSerper(
                { q: query, num: 10 },
                abortSignal,
              );

              console.log(`📊 Search returned ${results.organic.length} results`);

              return results.organic.map((result) => ({
                title: result.title,
                link: result.link,
                snippet: result.snippet,
              }));
            },
          },
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: (e) => {
      console.error(e);
      return "Oops, an error occured!";
    },
  });
}