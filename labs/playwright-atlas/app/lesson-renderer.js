// Render the small Markdown subset used by the canonical lessons with DOM nodes.
// Unrecognised HTML is text; links must pass the caller's explicit resolver.
export function renderLesson(markdown, resolveLink) {
  const output = document.createDocumentFragment();
  const containers = [output];
  const lines = markdown.replaceAll('\r', '').split('\n');
  const appendInline = (parent, text) => {
    const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
    let cursor = 0;
    for (const match of text.matchAll(pattern)) {
      parent.append(document.createTextNode(text.slice(cursor, match.index)));
      const token = match[0];
      if (token.startsWith('`') || token.startsWith('**')) {
        const node = document.createElement(token.startsWith('`') ? 'code' : 'strong');
        node.textContent = token.startsWith('`') ? token.slice(1, -1) : token.slice(2, -2);
        parent.append(node);
      } else {
        const [, label, target] = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
        const href = resolveLink(target);
        if (href && /^(?:https?:\/\/|\/(?!\/)|#)/.test(href)) {
          const anchor = document.createElement('a');
          anchor.textContent = label; anchor.href = href;
          if (href.startsWith('http') || href.startsWith('/learning/')) {
            anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
          }
          parent.append(anchor);
        } else parent.append(document.createTextNode(label));
      }
      cursor = match.index + token.length;
    }
    parent.append(document.createTextNode(text.slice(cursor)));
  };
  const add = (tag, text) => {
    const node = document.createElement(tag);
    if (text !== undefined) appendInline(node, text);
    containers.at(-1).append(node);
    return node;
  };
  const isBlock = line => /^(?:#{1,3} |\d+\. |[-*] |```|<\/?details>|<summary>|\|)/.test(line);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].trim();
    if (!line || line.startsWith('# ')) continue;
    if (line === '<details>') { const node = add('details'); containers.push(node); continue; }
    if (line === '</details>') { if (containers.length > 1) containers.pop(); continue; }
    const summary = /^<summary>(.*)<\/summary>$/.exec(line);
    if (summary) { add('summary', summary[1]); continue; }
    if (line.startsWith('```')) {
      const block = [];
      while (++index < lines.length && !lines[index].trim().startsWith('```')) block.push(lines[index]);
      const pre = add('pre'), code = document.createElement('code');
      pre.tabIndex = 0; pre.setAttribute('aria-label', 'Code example');
      code.textContent = block.join('\n'); pre.append(code); continue;
    }
    const heading = /^(#{2,3}) (.+)$/.exec(line);
    if (heading) { add(`h${heading[1].length}`, heading[2]); continue; }
    if (line.startsWith('|')) {
      const wrap = add('div'); wrap.className = 'table-wrap';
      const table = document.createElement('table'); wrap.append(table);
      let first = true;
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        const cells = lines[index].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
        if (!cells.every(cell => /^:?-+:?$/.test(cell))) {
          const row = document.createElement('tr'); table.append(row);
          for (const cell of cells) { const node = document.createElement(first ? 'th' : 'td'); appendInline(node, cell); row.append(node); }
          first = false;
        }
        index++;
      }
      index--; continue;
    }
    const ordered = /^\d+\. /.test(line), unordered = /^[-*] /.test(line);
    if (ordered || unordered) {
      const list = add(ordered ? 'ol' : 'ul');
      const itemPattern = ordered ? /^\d+\. / : /^[-*] /;
      if (ordered) list.start = Number(/^\d+/.exec(line)[0]);
      while (index < lines.length) {
        const current = lines[index].trim();
        if (!itemPattern.test(current)) break;
        const item = document.createElement('li'); list.append(item);
        appendInline(item, current.replace(itemPattern, ''));
        index++;
        while (index < lines.length && lines[index].trim() && !isBlock(lines[index].trim())) {
          item.append(document.createTextNode(' ')); appendInline(item, lines[index].trim()); index++;
        }
        let next = index;
        while (next < lines.length && !lines[next].trim()) next++;
        if (itemPattern.test(lines[next]?.trim() ?? '')) index = next;
        else break;
      }
      index--; continue;
    }
    const paragraph = [line];
    while (index + 1 < lines.length && lines[index + 1].trim() && !isBlock(lines[index + 1].trim())) paragraph.push(lines[++index].trim());
    add('p', paragraph.join(' '));
  }
  return output;
}
