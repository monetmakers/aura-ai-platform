import { useState, useRef } from "react";

const MOCK_DOCS = [
  { id: 1, name: "Product Catalogue 2026.pdf", size: "2.4 MB", chunks: 142, status: "processed", date: "Mar 10" },
  { id: 2, name: "FAQ & Policies.docx",        size: "0.8 MB", chunks: 67,  status: "processed", date: "Mar 9"  },
  { id: 3, name: "Return Policy.pdf",           size: "0.3 MB", chunks: 24,  status: "processing", date: "Mar 13" },
];

export default function DocumentsPage() {
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  function handleDrop(e) {
    e.preventDefault(); setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      setDocs(d => [...d, {
        id: Date.now() + Math.random(),
        name: file.name, size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        chunks: 0, status: "processing", date: "Just now"
      }]);
    });
  }

  function deleteDoc(id) { setDocs(d => d.filter(doc => doc.id !== id)); }

  return (
    <>
      <style>{css}</style>
      <div className="aura-topbar">
        <span className="aura-topbar-title">⊟ Documents</span>
        <button className="a-btn a-btn-primary" onClick={() => fileRef.current?.click()}>
          + Upload document
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.csv" multiple style={{ display: "none" }}
          onChange={e => {
            Array.from(e.target.files || []).forEach(file => {
              setDocs(d => [...d, { id: Date.now() + Math.random(), name: file.name, size: `${(file.size/1024/1024).toFixed(1)} MB`, chunks: 0, status: "processing", date: "Just now" }]);
            });
          }}
        />
      </div>

      <div className="aura-page">
        <div className="a-page-hd a-anim">
          <div>
            <div className="a-page-title">Knowledge Base</div>
            <div className="a-page-sub">Upload documents to train your AI agent with your business knowledge</div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div className="kb-stat"><span style={{ color: "#60a5fa", fontWeight: 800 }}>{docs.length}</span><span>Documents</span></div>
            <div className="kb-stat"><span style={{ color: "#34d399", fontWeight: 800 }}>{docs.filter(d => d.status === "processed").reduce((a, d) => a + d.chunks, 0)}</span><span>Chunks</span></div>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`drop-zone a-anim ${dragging ? "dragging" : ""}`}
          style={{ animationDelay: "0.05s" }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="drop-icon">⊟</div>
          <div className="drop-title">Drop files here or click to browse</div>
          <div className="drop-sub">PDF, DOCX, TXT, CSV — up to 20MB per file</div>
          <div className="drop-formats">
            {["PDF", "DOCX", "TXT", "CSV", "XLSX"].map(f => (
              <span key={f} className="format-tag">{f}</span>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div className="a-card a-anim" style={{ animationDelay: "0.1s", padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.4rem 0.75rem", borderBottom: "1px solid rgba(245,158,11,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#c8a96e" }}>Uploaded Documents</span>
            <span style={{ fontSize: "0.7rem", color: "#6b6355" }}>{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
          </div>

          {docs.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#4a4035", fontSize: "0.82rem" }}>
              No documents yet. Upload your first file above.
            </div>
          ) : (
            <div>
              {docs.map((doc, i) => (
                <div key={doc.id} className="doc-row" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className="doc-icon-wrap">
                    <span className="doc-icon">{doc.name.endsWith(".pdf") ? "📄" : doc.name.endsWith(".docx") ? "📝" : "📋"}</span>
                  </div>
                  <div className="doc-info">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-meta">
                      <span>{doc.size}</span>
                      <span className="dot-sep">·</span>
                      <span>{doc.status === "processed" ? `${doc.chunks} chunks` : "Processing…"}</span>
                      <span className="dot-sep">·</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>
                    <span className={`status-badge ${doc.status}`}>
                      {doc.status === "processed" ? "✓ Ready" : "⟳ Processing"}
                    </span>
                    <button className="doc-action-btn" title="Reprocess">↺</button>
                    <button className="doc-action-btn red" onClick={() => deleteDoc(doc.id)} title="Delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="a-card a-anim" style={{ animationDelay: "0.15s", background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#c8a96e", marginBottom: "0.6rem" }}>💡 Tips for better results</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
            {[
              { icon: "◈", text: "Use clean, well-formatted PDFs — avoid scanned images" },
              { icon: "⊟", text: "Include your FAQ, product descriptions, and policies" },
              { icon: "◉", text: "Update documents regularly so your agent stays current" },
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "0.55rem", fontSize: "0.75rem", color: "#6b6355", lineHeight: 1.5 }}>
                <span style={{ color: "#f59e0b", flexShrink: 0 }}>{tip.icon}</span>{tip.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .aura-topbar{display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:52px;flex-shrink:0;background:#0a0805;border-bottom:1px solid rgba(245,158,11,.1);}
  .aura-topbar-title{font-size:.85rem;font-weight:700;color:#c8a96e;}
  .aura-page{flex:1;overflow-y:auto;padding:2rem 2.4rem;display:flex;flex-direction:column;gap:1.4rem;}
  .aura-page::-webkit-scrollbar{width:4px;} .aura-page::-webkit-scrollbar-thumb{background:rgba(245,158,11,.15);border-radius:4px;}
  .a-page-hd{display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1rem;}
  .a-page-title{font-family:'Literata',serif;font-size:1.55rem;font-weight:500;color:#f5e6c8;letter-spacing:-.02em;}
  .a-page-sub{font-size:.8rem;color:#6b6355;margin-top:.25rem;}
  .a-card{background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:14px;padding:1.4rem 1.6rem;}
  .a-anim{animation:a-fadeUp .45s ease both;}
  .a-btn{display:inline-flex;align-items:center;gap:.45rem;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;border:none;transition:all .2s;white-space:nowrap;}
  .a-btn-primary{background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0805;border-radius:10px;padding:.5rem 1.1rem;font-size:.8rem;box-shadow:0 6px 20px rgba(245,158,11,.22);}
  .a-btn-primary:hover{transform:translateY(-1px);}

  .kb-stat{display:flex;flex-direction:column;align-items:center;background:#141109;border:1px solid rgba(245,158,11,.1);border-radius:10px;padding:.5rem .9rem;font-size:.68rem;color:#6b6355;gap:.1rem;min-width:64px;}

  .drop-zone{border:2px dashed rgba(245,158,11,.2);border-radius:14px;padding:2.5rem;text-align:center;cursor:pointer;transition:all .2s;background:rgba(245,158,11,.02);}
  .drop-zone:hover,.drop-zone.dragging{border-color:rgba(245,158,11,.45);background:rgba(245,158,11,.06);}
  .drop-icon{font-size:2rem;margin-bottom:.75rem;color:#f59e0b;}
  .drop-title{font-size:.95rem;font-weight:700;color:#c8a96e;margin-bottom:.3rem;}
  .drop-sub{font-size:.75rem;color:#6b6355;margin-bottom:1rem;}
  .drop-formats{display:flex;gap:.4rem;justify-content:center;flex-wrap:wrap;}
  .format-tag{font-size:.62rem;font-weight:700;letter-spacing:.06em;padding:.18rem .55rem;border-radius:6px;background:rgba(245,158,11,.08);color:#6b6355;border:1px solid rgba(245,158,11,.12);}

  .doc-row{display:flex;align-items:center;gap:.9rem;padding:.9rem 1.4rem;border-bottom:1px solid rgba(245,158,11,.06);transition:background .15s;animation:a-fadeUp .4s ease both;}
  .doc-row:last-child{border-bottom:none;}
  .doc-row:hover{background:rgba(245,158,11,.03);}
  .doc-icon-wrap{width:36px;height:36px;border-radius:9px;background:rgba(245,158,11,.08);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;}
  .doc-name{font-size:.82rem;font-weight:600;color:#c8a96e;margin-bottom:.15rem;}
  .doc-meta{font-size:.68rem;color:#6b6355;display:flex;gap:.4rem;align-items:center;}
  .dot-sep{color:#4a4035;}
  .status-badge{font-size:.62rem;font-weight:700;padding:.18rem .55rem;border-radius:100px;letter-spacing:.04em;}
  .status-badge.processed{background:rgba(52,211,153,.08);color:#34d399;border:1px solid rgba(52,211,153,.18);}
  .status-badge.processing{background:rgba(245,158,11,.08);color:#f59e0b;border:1px solid rgba(245,158,11,.18);}
  .doc-action-btn{width:26px;height:26px;border-radius:6px;background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.1);color:#6b6355;font-size:.75rem;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center;}
  .doc-action-btn:hover{color:#c8a96e;border-color:rgba(245,158,11,.2);}
  .doc-action-btn.red:hover{background:rgba(248,113,113,.08);color:#f87171;border-color:rgba(248,113,113,.2);}

  @keyframes a-fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
`;
