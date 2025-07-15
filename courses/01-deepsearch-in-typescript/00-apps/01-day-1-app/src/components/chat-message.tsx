import ReactMarkdown, { type Components } from "react-markdown";
import type { Message } from "ai";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export type MessagePart = NonNullable<Message["parts"]>[number];

interface ChatMessageProps {
  parts: MessagePart[] | undefined;
  role: string;
  userName: string;
}

const components: Components = {
  // Override default elements with custom styling
  p: ({ children }) => <p className="mb-4 first:mt-0 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ className, children, ...props }) => (
    <code className={`${className ?? ""}`} {...props}>
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-700 p-4">
      {children}
    </pre>
  ),
  a: ({ children, ...props }) => (
    <a
      className="text-blue-400 underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
};

const Markdown = ({ children }: { children: string }) => {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
};

const ToolInvocation = ({
  toolInvocation,
}: {
  toolInvocation: Extract<
    MessagePart,
    { type: "tool-invocation" }
  >["toolInvocation"];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-4 rounded-lg border border-gray-600 bg-gray-800 p-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 text-left text-sm font-semibold text-blue-400 hover:text-blue-300"
      >
        {isExpanded ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
        🔧 {toolInvocation.toolName}
        {toolInvocation.state === "partial-call" && (
          <span className="ml-2 text-yellow-400">(calling...)</span>
        )}
      </button>

      {isExpanded && (
        <div className="mt-3">
          {toolInvocation.state === "partial-call" && (
            <div className="text-yellow-400">Calling tool...</div>
          )}

          {toolInvocation.state === "call" && (
            <div>
              <div className="mb-2 text-sm text-gray-400">Arguments:</div>
              <pre className="overflow-x-auto rounded bg-gray-700 p-2 text-xs">
                {JSON.stringify(toolInvocation.args, null, 2)}
              </pre>
            </div>
          )}

          {toolInvocation.state === "result" && (
            <div>
              <div className="mb-2 text-sm text-gray-400">Arguments:</div>
              <pre className="mb-3 overflow-x-auto rounded bg-gray-700 p-2 text-xs">
                {JSON.stringify(toolInvocation.args, null, 2)}
              </pre>
              <div className="mb-2 text-sm text-gray-400">Result:</div>
              <pre className="overflow-x-auto rounded bg-gray-700 p-2 text-xs">
                {JSON.stringify(toolInvocation.result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ChatMessage = ({ parts, role, userName }: ChatMessageProps) => {
  const isAI = role === "assistant";

  return (
    <div className="mb-6">
      <div
        className={`rounded-lg p-4 ${
          isAI ? "bg-gray-800 text-gray-300" : "bg-gray-900 text-gray-300"
        }`}
      >
        <p className="mb-2 text-sm font-semibold text-gray-400">
          {isAI ? "AI" : userName}
        </p>

        <div className="prose prose-invert max-w-none">
          {parts?.map((part, index) => {
            switch (part.type) {
              case "text":
                return <Markdown key={index}>{part.text}</Markdown>;
              case "tool-invocation":
                return (
                  <ToolInvocation
                    key={index}
                    toolInvocation={part.toolInvocation}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
};
