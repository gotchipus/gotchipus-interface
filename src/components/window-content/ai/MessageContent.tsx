import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  content: string;
}

export const MessageContent = memo(({ content }: MessageContentProps) => (
  <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        h1: ({ className, ...props }) => (
          <h1 className={cn("text-xl font-bold my-3 text-[#222]", className)} {...props} />
        ),
        h2: ({ className, ...props }) => (
          <h2 className={cn("text-lg font-bold my-2.5 text-[#222]", className)} {...props} />
        ),
        h3: ({ className, ...props }) => (
          <h3 className={cn("text-base font-bold my-2 text-[#222]", className)} {...props} />
        ),
        p: ({ className, ...props }) => (
          <p className={cn("mb-2 text-[#222]", className)} {...props} />
        ),
        ul: ({ className, ...props }) => (
          <ul className={cn("list-disc ml-5 mb-3 text-[#222]", className)} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol className={cn("list-decimal ml-5 mb-3 text-[#222]", className)} {...props} />
        ),
        li: ({ className, ...props }) => (
          <li className={cn("mb-1 text-[#222]", className)} {...props} />
        ),
        code: ({ className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          const isInline = !match;
          return !isInline ? (
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto my-3">
              <code
                className={cn(match ? `language-${match[1]}` : "", "text-sm font-mono")}
                {...props}
              >
                {children}
              </code>
            </pre>
          ) : (
            <code
              className={cn("bg-gray-100 px-1 rounded text-sm font-mono text-[#222]", className)}
              {...props}
            >
              {children}
            </code>
          );
        },
        a: ({ className, ...props }) => (
          <a
            className={cn("text-blue-600 hover:underline", className)}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ className, ...props }) => (
          <blockquote
            className={cn("border-l-4 border-gray-300 pl-4 italic my-3", className)}
            {...props}
          />
        ),
        table: ({ className, ...props }) => (
          <div className="overflow-x-auto my-3">
            <table
              className={cn("min-w-full border border-gray-300 text-[#222]", className)}
              {...props}
            />
          </div>
        ),
        thead: ({ className, ...props }) => (
          <thead className={cn("bg-gray-100", className)} {...props} />
        ),
        tbody: (props) => <tbody {...props} />,
        tr: ({ className, ...props }) => (
          <tr className={cn("border-b border-gray-300", className)} {...props} />
        ),
        th: ({ className, ...props }) => (
          <th
            className={cn("border-r border-gray-300 px-3 py-1 font-semibold text-left", className)}
            {...props}
          />
        ),
        td: ({ className, ...props }) => (
          <td className={cn("border-r border-gray-300 px-3 py-1", className)} {...props} />
        ),
        em: ({ className, ...props }) => (
          <em className={cn("italic text-[#222]", className)} {...props} />
        ),
        strong: ({ className, ...props }) => (
          <strong className={cn("font-bold text-[#222]", className)} {...props} />
        ),
        hr: ({ className, ...props }) => (
          <hr className={cn("my-4 border-t border-gray-300", className)} {...props} />
        ),
        img: ({ className, ...props }: any) => (
          <img
            className={cn("max-w-full h-auto my-3 rounded", className)}
            {...props}
            alt={props.alt || "Image"}
            loading="lazy"
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
));

MessageContent.displayName = "MessageContent"; 