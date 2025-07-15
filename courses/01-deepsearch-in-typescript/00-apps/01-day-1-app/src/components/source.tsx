import { ExternalLink } from "lucide-react";
import type { MessagePart } from "./chat-message";

interface SourceProps {
  part: Extract<MessagePart, { type: "source" }>;
}

export const Source = ({ part }: SourceProps) => {
  const { source } = part;

  return (
    <div className="mb-4 rounded-lg border border-blue-600/30 bg-blue-900/20 p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
        <ExternalLink className="size-4" />
        Source
      </div>
      <div className="mt-2">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          {source.title ?? source.url}
        </a>
        {source.title && (
          <div className="mt-1 text-xs text-gray-400">{source.url}</div>
        )}
      </div>
    </div>
  );
};