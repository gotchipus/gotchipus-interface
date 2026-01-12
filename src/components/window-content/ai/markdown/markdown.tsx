import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import { useRef, useState, useEffect, useMemo } from "react";
import mermaid from "mermaid";
import React from "react";
import { cleanAIText } from '../utils';
import './markdown-win98.css';

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
  }, [props.code]);

  if (hasError) {
    return null;
  }

  return (
    <div
      className="no-dark mermaid"
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: { children?: React.ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [mermaidCode, setMermaidCode] = useState("");

  const renderArtifacts = () => {
    if (!ref.current) return;
    const mermaidDom = ref.current.querySelector("code.language-mermaid");
    if (mermaidDom) {
      setMermaidCode((mermaidDom as HTMLElement).innerText);
    }
  };

  useEffect(() => {
    if (ref.current) {
      const codeElements = ref.current.querySelectorAll(
        "code",
      ) as NodeListOf<HTMLElement>;
      const wrapLanguages = [
        "",
        "md",
        "markdown",
        "text",
        "txt",
        "plaintext",
        "tex",
        "latex",
      ];
      codeElements.forEach((codeElement) => {
        let languageClass = codeElement.className.match(/language-(\w+)/);
        let name = languageClass ? languageClass[1] : "";
        if (wrapLanguages.includes(name)) {
          codeElement.style.whiteSpace = "pre-wrap";
        }
      });
      setTimeout(renderArtifacts, 1);
    }
  }, []);

  return (
    <>
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const codeText = ref.current.querySelector("code")?.innerText ?? "";
              navigator.clipboard.writeText(codeText);
            }
          }}
        ></span>
        {props.children}
      </pre>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
    </>
  );
}

function CustomCode(props: { children?: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const codeHeight = ref.current.scrollHeight;
      setShowToggle(codeHeight > 400);
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.children]);

  const toggleCollapsed = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  const renderShowMoreButton = () => {
    if (showToggle && collapsed) {
      return (
        <div className="show-hide-button collapsed">
          <button onClick={toggleCollapsed}>Show More</button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <code
        className={props?.className}
        ref={ref}
        style={{
          maxHeight: collapsed ? "400px" : "none",
          overflowY: "hidden",
        }}
      >
        {props.children}
      </code>
      {renderShowMoreButton()}
    </>
  );
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function tryWrapHtmlCode(text: string) {
  if (text.includes("```")) {
    return text;
  }
  return text
    .replace(
      /([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g,
      (match, quoteStart, lang, newLine, doctype) => {
        return !quoteStart ? "\n```html\n" + doctype : match;
      },
    )
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, newLine, quoteEnd) => {
        return !quoteEnd ? bodyEnd + space + htmlEnd + "\n```\n" : match;
      },
    );
}

function _MarkDownContent(props: { content: string }) {
  const escapedContent = useMemo(() => {
    return tryWrapHtmlCode(escapeBrackets(props.content));
  }, [props.content]);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        code: (codeProps: any) => {
          // 行内代码
          if (!codeProps.className) {
            return (
              <code 
                {...codeProps} 
                style={{
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #c0c0c0",
                  borderRadius: "3px",
                  padding: "0.2em 0.4em",
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: "0.9em",
                  color: "#000000"
                }}
              />
            );
          }
          // 代码块
          return <CustomCode {...codeProps} />;
        },
        p: (pProps) => <p {...pProps} dir="auto" style={{ margin: "0.5em 0", lineHeight: "1.6" }} />,
        h1: (hProps) => <h1 {...hProps} style={{ fontSize: "1.5em", fontWeight: "bold", margin: "1em 0 0.5em 0", color: "#000080", borderBottom: "2px solid #808080", paddingBottom: "0.3em" }} />,
        h2: (hProps) => <h2 {...hProps} style={{ fontSize: "1.3em", fontWeight: "bold", margin: "1em 0 0.5em 0", color: "#000080", borderBottom: "1px solid #c0c0c0", paddingBottom: "0.3em" }} />,
        h3: (hProps) => <h3 {...hProps} style={{ fontSize: "1.1em", fontWeight: "bold", margin: "1em 0 0.5em 0", color: "#000080" }} />,
        h4: (hProps) => <h4 {...hProps} style={{ fontSize: "1em", fontWeight: "bold", margin: "0.8em 0 0.4em 0", color: "#000080" }} />,
        h5: (hProps) => <h5 {...hProps} style={{ fontSize: "0.9em", fontWeight: "bold", margin: "0.8em 0 0.4em 0", color: "#000080" }} />,
        h6: (hProps) => <h6 {...hProps} style={{ fontSize: "0.85em", fontWeight: "bold", margin: "0.8em 0 0.4em 0", color: "#000080" }} />,
        ul: (ulProps) => <ul {...ulProps} style={{ margin: "0.5em 0", paddingLeft: "1.5em", listStyleType: "disc" }} />,
        ol: (olProps) => <ol {...olProps} style={{ margin: "0.5em 0", paddingLeft: "1.5em", listStyleType: "decimal" }} />,
        li: (liProps) => <li {...liProps} style={{ margin: "0.2em 0", lineHeight: "1.5" }} />,
        strong: (strongProps) => <strong {...strongProps} style={{ fontWeight: "bold", color: "#000080" }} />,
        em: (emProps) => <em {...emProps} style={{ fontStyle: "italic", color: "#000000" }} />,
        blockquote: (bqProps) => (
          <blockquote {...bqProps} style={{ 
            margin: "1em 0", 
            padding: "0.5em 1em", 
            borderLeft: "3px solid #808080",
            backgroundColor: "#f0f0f0",
            fontStyle: "italic",
            borderRadius: "2px"
          }} />
        ),
        hr: (hrProps) => <hr {...hrProps} style={{ border: "1px solid #808080", margin: "1em 0" }} />,
        table: (tableProps) => (
          <table {...tableProps} style={{ 
            borderCollapse: "collapse", 
            width: "100%", 
            margin: "1em 0",
            border: "2px solid #808080"
          }} />
        ),
        th: (thProps) => (
          <th {...thProps} style={{ 
            border: "1px solid #808080", 
            padding: "0.5em",
            backgroundColor: "#c0c0c0",
            fontWeight: "bold"
          }} />
        ),
        td: (tdProps) => (
          <td {...tdProps} style={{ 
            border: "1px solid #808080", 
            padding: "0.5em"
          }} />
        ),
        a: (aProps) => {
          const href = aProps.href || "";
          if (/\.(aac|mp3|opus|wav)$/.test(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }
          if (/\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} style={{ color: "#0000ff", textDecoration: "underline" }} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export default function Markdown({ content }: { content: string }) {
  const mdRef = useRef<HTMLDivElement>(null);
  
  const processedContent = cleanAIText(content);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: "16px",
        fontFamily: "inherit",
        lineHeight: "1.6",
        color: "#000000",
        backgroundColor: "transparent",
      }}
      ref={mdRef}
      dir="auto"
    >
      <MarkdownContent content={processedContent} />
    </div>
  );
}