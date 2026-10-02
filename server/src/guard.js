// Screens visitor text before it reaches the AI. The terminal never runs anything, but code,
// attack payloads and jailbreak attempts are refused here so they cost no API calls.

// Control and zero-width characters can hide text from a human reader; drop them (keep \n and \t).
const INVISIBLE_RE = /[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu;

export const stripInvisible = (text) => text.replace(INVISIBLE_RE, (c) => (c === "\n" || c === "\t" ? c : ""));

const PATTERNS = [
  // HTML / script injection
  /<\s*\/?\s*(script|iframe|img|svg|object|embed|style|link|meta|form|body|html)\b/i,
  /javascript\s*:/i,
  /\bon(error|load|click|mouseover|focus)\s*=/i,
  // destructive shell commands
  /\brm\s+-\w*[rf]/i,
  /:\s*\(\s*\)\s*\{[^}]*\}\s*;?\s*:/, // fork bomb
  /\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z|da)?sh\b/i,
  /\b(mkfs(\.\w+)?|dd\s+if=|shutdown\s+-|chmod\s+-?R?\s*[0-7]{3}|chown\s+-R)\b/i,
  /\$\([^)]*\)/, // command substitution
  />\s*\/dev\/(sd|null|zero)|\/etc\/(passwd|shadow)/i,
  // code execution
  /\b(eval|exec|execSync|spawn)\s*\(|child_process|require\s*\(|process\.(env|exit)|__import__|os\.system/i,
  // SQL / NoSQL injection
  /\b(drop|truncate|alter)\s+(table|database)\b|\bunion\s+(all\s+)?select\b|\bdelete\s+from\b/i,
  /'\s*or\s+'?\d+'?\s*=\s*'?\d+|;\s*--/i,
  /\{\s*"?\$(where|ne|gt|lt|regex|expr)\b/i,
  // path traversal
  /(\.\.[/\\]){2,}/,
  // prompt injection
  /\b(ignore|disregard|forget)\b.{0,30}\b(previous|prior|above|earlier|all|your)\b.{0,20}\b(instructions?|rules|prompt)/i,
  /\b(reveal|show|print|repeat|leak)\b.{0,30}\b(system\s+prompt|your\s+(instructions|prompt|rules))/i,
  /\b(you\s+are\s+now|jailbreak|DAN\s+mode|developer\s+mode)\b/i,
];

export const BLOCKED_MESSAGE =
  "That looks like code or a command. This terminal is a read-only sandbox: ask about my resume or type `help`.";

// True when the text looks like code, an attack payload or a jailbreak attempt.
export const isBlocked = (text) => PATTERNS.some((pattern) => pattern.test(text));
