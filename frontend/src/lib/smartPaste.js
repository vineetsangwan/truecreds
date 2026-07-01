// src/lib/smartPaste.js
//
// Converts plain text pasted from ChatGPT, Word, Google Docs, etc. into
// clean markdown — auto-detects tables, bullet lists, numbered lists,
// and short standalone lines that look like headers.

function looksLikeTableRow(line) {
  // Word/ChatGPT copy-paste usually separates table cells with tabs,
  // or with 2+ consecutive spaces if tabs got stripped.
  return /\t/.test(line) || /\s{2,}\S+\s{2,}/.test(line.trim());
}

function splitRow(line) {
  return line
    .split(/\t+|\s{2,}/)
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

function looksLikeBullet(line) {
  return /^[•\-\*▪●○]\s+/.test(line.trim());
}

function looksLikeNumbered(line) {
  return /^\d+[\.\)]\s+/.test(line.trim());
}

function looksLikeHeader(line, nextLine) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.length > 70) return false; // headers are short
  if (/[.!?,;:]$/.test(trimmed)) return false; // sentences end in punctuation, headers usually don't
  // Heuristic: standalone short line, followed by a longer paragraph or blank line
  const nextTrimmed = (nextLine || '').trim();
  const nextIsContent = nextTrimmed.length > 70 || nextTrimmed === '';
  return nextIsContent;
}

function convertBulletLine(line) {
  return '- ' + line.trim().replace(/^[•\-\*▪●○]\s+/, '');
}

function convertNumberedLine(line) {
  return line.trim(); // markdown numbered lists just need "1. text" — already close enough
}

function buildMarkdownTable(rows) {
  if (rows.length === 0) return '';
  const colCount = Math.max(...rows.map((r) => r.length));
  const pad = (row) => {
    const copy = [...row];
    while (copy.length < colCount) copy.push('');
    return copy;
  };
  const header = pad(rows[0]);
  const separator = header.map(() => '---');
  const body = rows.slice(1).map(pad);

  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ];
  return lines.join('\n');
}

/**
 * Main export — call this with the raw pasted plain text.
 * Returns a markdown-formatted string.
 */
export function convertPlainTextToMarkdown(rawText) {
  const lines = rawText.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line — preserve as paragraph break
    if (trimmed === '') {
      output.push('');
      i++;
      continue;
    }

    // Table detection — look ahead, collect consecutive table-like rows
    if (looksLikeTableRow(line)) {
      const tableRows = [];
      while (i < lines.length && looksLikeTableRow(lines[i])) {
        tableRows.push(splitRow(lines[i]));
        i++;
      }
      if (tableRows.length >= 2) {
        output.push(buildMarkdownTable(tableRows));
        output.push('');
        continue;
      } else {
        // Only one row matched — treat as normal text instead
        output.push(tableRows[0].join(' '));
        continue;
      }
    }

    // Bullet list
    if (looksLikeBullet(line)) {
      output.push(convertBulletLine(line));
      i++;
      continue;
    }

    // Numbered list
    if (looksLikeNumbered(line)) {
      output.push(convertNumberedLine(line));
      i++;
      continue;
    }

    // Header heuristic
    const nextLine = lines[i + 1];
    if (looksLikeHeader(line, nextLine)) {
      output.push(`## ${trimmed}`);
      i++;
      continue;
    }

    // Default — regular paragraph text
    output.push(trimmed);
    i++;
  }

  // Collapse 3+ blank lines into max 2 (one empty line between blocks)
  return output.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}