import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0c0c0f;
    --surface:   #131318;
    --surface2:  #1a1a22;
    --border:    rgba(255,255,255,0.07);
    --border2:   rgba(255,255,255,0.12);
    --accent:    #c8a96e;
    --accent2:   #e8c87e;
    --text:      #e8e6df;
    --muted:     #6b6878;
    --muted2:    #9997a8;
    --user-bg:   #1e1c2e;
    --user-acc:  #7c6fe0;
    --danger:    #e07c7c;
    --success:   #7ce0a8;
    --r:         14px;
    --r-sm:      8px;
    --serif:     'Instrument Serif', Georgia, serif;
    --sans:      'DM Sans', system-ui, sans-serif;
    --ease:      cubic-bezier(0.4,0,0.2,1);
  }

  html, body, #root { height: 100%; }
  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar {
    width: 258px; min-width: 258px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: relative; overflow: hidden;
  }
  .sidebar::after {
    content: '';
    position: absolute; top: -100px; left: -60px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  .sb-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 11px;
  }
  .sb-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg, #c8a96e 0%, #7a4f22 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; color: #0c0c0f;
  }
  .sb-name { font-family: var(--serif); font-size: 18px; letter-spacing: 0.01em; }
  .sb-sub  { font-size: 10px; color: var(--muted); letter-spacing: 0.09em; text-transform: uppercase; margin-top: 2px; }

  .new-btn {
    margin: 14px 14px 8px;
    padding: 9px 14px;
    border: 1px solid var(--border2);
    border-radius: var(--r-sm);
    background: transparent;
    color: var(--text);
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    cursor: pointer; display: flex; align-items: center; gap: 8px;
    transition: all 0.2s var(--ease);
    letter-spacing: 0.01em;
  }
  .new-btn:hover { background: var(--surface2); border-color: var(--accent); color: var(--accent); }

  .sb-section { padding: 8px 18px 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); font-weight: 500; }
  .sb-list { flex: 1; overflow-y: auto; padding: 2px 10px 8px; }

  .sb-item {
    padding: 9px 11px; border-radius: var(--r-sm);
    cursor: pointer; font-size: 13px; color: var(--muted2);
    display: flex; align-items: center; gap: 8px; margin-bottom: 2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    transition: all 0.18s var(--ease); border: 1px solid transparent;
  }
  .sb-item:hover { background: var(--surface2); color: var(--text); }
  .sb-item.active { background: var(--surface2); color: var(--accent); border-color: rgba(200,169,110,0.14); }
  .sb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); flex-shrink: 0; transition: background 0.2s; }
  .sb-item.active .sb-dot { background: var(--accent); }

  .sb-foot {
    padding: 13px 18px; border-top: 1px solid var(--border);
    font-size: 11px; color: var(--muted); letter-spacing: 0.04em; text-align: center;
  }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    padding: 15px 28px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .topbar-title { font-family: var(--serif); font-size: 20px; font-style: italic; }
  .topbar-meta { font-size: 12px; color: var(--muted); margin-top: 2px; letter-spacing: 0.02em; }
  .live-badge { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--muted2); }
  .live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--success); box-shadow: 0 0 7px rgba(124,224,168,0.55);
    animation: pulse 2.2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }

  /* Upload strip */
  .upload-strip {
    padding: 9px 24px; background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .up-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--muted); font-weight: 500; white-space: nowrap; }

  .file-pill {
    position: relative; flex: 1; max-width: 280px;
  }
  .file-pill input[type=file] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; }
  .file-pill-inner {
    border: 1px dashed var(--border2); border-radius: 99px;
    padding: 6px 14px; font-size: 12px; color: var(--muted2);
    display: flex; align-items: center; gap: 7px;
    transition: all 0.2s var(--ease); background: var(--surface2); cursor: pointer;
  }
  .file-pill-inner:hover { border-color: var(--accent); color: var(--accent); }

  .up-btn {
    padding: 7px 18px; border: none; border-radius: 99px;
    background: var(--accent); color: #0c0c0f;
    font-family: var(--sans); font-size: 12px; font-weight: 600;
    cursor: pointer; letter-spacing: 0.04em;
    transition: all 0.2s var(--ease); white-space: nowrap;
  }
  .up-btn:hover:not(:disabled) { background: var(--accent2); transform: scale(1.03); }
  .up-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .up-status { font-size: 12px; padding: 5px 11px; border-radius: 99px; }
  .up-status.success { color: var(--success); background: rgba(124,224,168,0.09); }
  .up-status.error   { color: var(--danger);  background: rgba(224,124,124,0.09); }
  .up-status.loading { color: var(--accent);  background: rgba(200,169,110,0.09); }

  /* Messages */
  .msgs {
    flex: 1; overflow-y: auto; padding: 28px 36px;
    display: flex; flex-direction: column; gap: 22px;
  }

  /* Empty state */
  .empty {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; text-align: center; padding: 48px;
    animation: fadeUp 0.5s ease;
  }
  .empty-glyph {
    width: 60px; height: 60px; border-radius: 18px;
    background: var(--surface2); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; margin-bottom: 4px;
  }
  .empty-h { font-family: var(--serif); font-size: 24px; font-style: italic; color: var(--text); margin-bottom: 2px; }
  .empty-p { font-size: 13.5px; color: var(--muted); max-width: 340px; line-height: 1.65; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; }
  .chip {
    padding: 7px 15px; border: 1px solid var(--border2); border-radius: 99px;
    font-size: 12.5px; color: var(--muted2); cursor: pointer;
    background: var(--surface2); transition: all 0.18s var(--ease);
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); background: rgba(200,169,110,0.05); }

  /* Message rows */
  .msg-row { display: flex; gap: 12px; animation: fadeUp 0.28s ease; }
  .msg-row.user { flex-direction: row-reverse; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(9px)} to{opacity:1;transform:none} }

  .av {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; margin-top: 4px;
  }
  .av.ai   { background: linear-gradient(135deg, #c8a96e, #6b4e1e); color: #0c0c0f; }
  .av.user { background: linear-gradient(135deg, #7c6fe0, #3b2fa0); color: #fff; }

  .msg-body { max-width: 66%; display: flex; flex-direction: column; gap: 4px; }
  .msg-row.user .msg-body { align-items: flex-end; }

  .msg-who { font-size: 11px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--muted); font-weight: 500; padding: 0 3px; }

  .bubble {
    padding: 13px 17px; border-radius: var(--r);
    font-size: 14px; line-height: 1.72;
  }
  .bubble.ai {
    background: var(--surface2); border: 1px solid var(--border);
    border-top-left-radius: 3px; color: var(--text);
  }
  .bubble.user {
    background: var(--user-bg); border: 1px solid rgba(124,111,224,0.22);
    border-top-right-radius: 3px; color: #d4d0f5;
  }

  /* Thinking */
  .thinking {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--r); border-top-left-radius: 3px;
    font-size: 13px; color: var(--muted2); font-style: italic;
    width: fit-content; animation: fadeUp 0.28s ease;
  }
  .dots { display: flex; gap: 4px; }
  .dots b {
    display: block; width: 5px; height: 5px; border-radius: 50%;
    background: var(--accent); animation: bop 1.2s ease-in-out infinite;
  }
  .dots b:nth-child(2){animation-delay:.2s} .dots b:nth-child(3){animation-delay:.4s}
  @keyframes bop { 0%,80%,100%{transform:translateY(0);opacity:.4} 40%{transform:translateY(-5px);opacity:1} }

  /* Input */
  .inputbar { padding: 16px 28px 22px; background: var(--surface); border-top: 1px solid var(--border); }
  .input-box {
    display: flex; align-items: flex-end; gap: 9px;
    background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--r); padding: 10px 10px 10px 17px;
    transition: all 0.2s var(--ease);
  }
  .input-box:focus-within { border-color: rgba(200,169,110,0.38); box-shadow: 0 0 0 3px rgba(200,169,110,0.05); }

  .cinput {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: var(--sans); font-size: 14px; color: var(--text);
    resize: none; min-height: 24px; max-height: 140px;
    line-height: 1.6; overflow-y: auto;
  }
  .cinput::placeholder { color: var(--muted); }

  .send {
    width: 37px; height: 37px; border-radius: var(--r-sm); border: none;
    background: var(--accent); color: #0c0c0f;
    cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s var(--ease);
  }
  .send:hover:not(:disabled) { background: var(--accent2); transform: scale(1.05); }
  .send:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .hint { margin-top: 9px; font-size: 11px; color: var(--muted); text-align: center; letter-spacing: 0.03em; }
`;

function injectStyles() {
  if (document.getElementById("lexis-styles")) return;
  const s = document.createElement("style");
  s.id = "lexis-styles";
  s.textContent = STYLES;
  document.head.appendChild(s);
}

const HINTS = ["Summarize the document", "What are the key findings?", "List the action items", "Compare main topics"];

export default function App() {
  injectStyles();

  const [query, setQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [idx, setIdx] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chats, loading]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [query]);

  const uploadFile = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setStatus({ text: "Uploading…", type: "loading" });
      await axios.post(`${API}/upload`, fd);
      setStatus({ text: "✓ Indexed successfully", type: "success" });
    } catch {
      setStatus({ text: "Upload failed", type: "error" });
    }
  };

  const newChat = () => {
    setChats(p => [...p, []]);
    setIdx(chats.length);
  };

  const send = async (text) => {
    const q = (text || query).trim();
    if (!q) return;

    let ci = idx;
    let base = [...chats];
    if (ci === null || ci >= base.length) {
      base.push([]);
      ci = base.length - 1;
      setIdx(ci);
    }

    base[ci] = [...(base[ci] || []), { role: "user", content: q }];
    setChats([...base]);
    setQuery("");
    setLoading(true);

    try {
      const res = await axios.get(`${API}/ask`, { params: { query: q } });
      const raw = res.data?.answer;
      const answer = typeof raw === "string" ? raw : raw?.text || raw?.answer || JSON.stringify(raw);
      base[ci] = [...base[ci], { role: "assistant", content: answer }];
    } catch {
      base[ci] = [...base[ci], { role: "assistant", content: "⚠️ Something went wrong. Please try again." }];
    }

    setChats([...base]);
    setLoading(false);
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const current = chats[idx] || [];
  const empty = current.length === 0 && !loading;

  const chatTitle = (chat) => {
    const t = chat[0]?.content || "New Conversation";
    return t.length > 28 ? t.slice(0, 27) + "…" : t;
  };

  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sb-logo">
          <div className="sb-icon">✦</div>
          <div>
            <div className="sb-name">Lexis</div>
            <div className="sb-sub">Knowledge Assistant</div>
          </div>
        </div>

        <button className="new-btn" onClick={newChat}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Conversation
        </button>

        {chats.length > 0 && (
          <>
            <div className="sb-section">Recent</div>
            <div className="sb-list">
              {chats.map((c, i) => (
                <div key={i} className={`sb-item ${i === idx ? "active" : ""}`} onClick={() => setIdx(i)}>
                  <span className="sb-dot" />
                  {chatTitle(c)}
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ flex: 1 }} />
        <div className="sb-foot">Powered by AI · {new Date().getFullYear()}</div>
      </aside>

      {/* Main */}
      <main className="main">

        {/* Top bar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {idx !== null && chats[idx]?.length
                ? chatTitle(chats[idx])
                : "Ask anything"}
            </div>
            <div className="topbar-meta">
              {current.length
                ? `${Math.ceil(current.length / 2)} exchange${current.length > 2 ? "s" : ""}`
                : "Start a new conversation below"}
            </div>
          </div>
          <div className="live-badge">
            <span className="live-dot" /> Connected
          </div>
        </div>

        {/* Upload */}
        <div className="upload-strip">
          <span className="up-label">Upload</span>
          <div className="file-pill">
            <input type="file" onChange={e => { setFile(e.target.files[0]); setFileName(e.target.files[0]?.name || ""); setStatus({ text: "", type: "" }); }} />
            <div className="file-pill-inner">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {fileName || "Choose a file…"}
            </div>
          </div>
          <button className="up-btn" onClick={uploadFile} disabled={!file}>Index File</button>
          {status.text && <span className={`up-status ${status.type}`}>{status.text}</span>}
        </div>

        {/* Messages */}
        <div className="msgs">
          {empty ? (
            <div className="empty">
              <div className="empty-glyph">✦</div>
              <div className="empty-h">What would you like to explore?</div>
              <p className="empty-p">Upload a document and ask questions, or start a conversation right away.</p>
              <div className="chips">
                {HINTS.map(h => <button key={h} className="chip" onClick={() => send(h)}>{h}</button>)}
              </div>
            </div>
          ) : (
            <>
              {current.map((m, i) => (
                <div key={i} className={`msg-row ${m.role}`}>
                  <div className={`av ${m.role === "assistant" ? "ai" : "user"}`}>
                    {m.role === "assistant" ? "✦" : "U"}
                  </div>
                  <div className="msg-body">
                    <span className="msg-who">{m.role === "assistant" ? "Lexis" : "You"}</span>
                    <div className={`bubble ${m.role === "assistant" ? "ai" : "user"}`}>{m.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="msg-row">
                  <div className="av ai">✦</div>
                  <div className="msg-body">
                    <span className="msg-who">Lexis</span>
                    <div className="thinking">
                      <div className="dots"><b/><b/><b/></div>
                      Thinking…
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="inputbar">
          <div className="input-box">
            <textarea
              ref={taRef}
              className="cinput"
              rows={1}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask a question… (Shift+Enter for new line)"
            />
            <button className="send" onClick={() => send()} disabled={loading || !query.trim()}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <div className="hint">Enter to send · Shift+Enter for new line</div>
        </div>
      </main>
    </div>
  );
}