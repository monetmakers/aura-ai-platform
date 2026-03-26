import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

const MOCK_DOCS = [
  { id: 1, name: "Product Catalogue 2026.pdf", size: "2.4 MB", chunks: 142, status: "processed", date: "Mar 10" },
  { id: 2, name: "FAQ & Policies.docx",        size: "0.8 MB", chunks: 67,  status: "processed", date: "Mar 9"  },
  { id: 3, name: "Return Policy.pdf",           size: "0.3 MB", chunks: 24,  status: "processing", date: "Mar 13" },
];

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [docs, setDocs] = useState(MOCK_DOCS);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
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

  function deleteDoc(id: number | string) { setDocs(d => d.filter(doc => doc.id !== id)); }

  const tips = [
    { icon: "📚", text: t("documents.tip1") },
    { icon: "⚡", text: t("documents.tip2") },
    { icon: "✓", text: t("documents.tip3") },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="docs-page">
        
        <div className="page-header">
          <div>
            <h1 className="page-title">{t("documents.title")}</h1>
            <p className="page-subtitle">{t("documents.subtitle")}</p>
          </div>
          <div className="stats-row">
            <div className="stat-pill">
              <span className="stat-value" style={{ color: "#3b82f6" }}>{docs.length}</span>
              <span className="stat-label">{t("documents.uploadedDocuments")}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-value" style={{ color: "#10b981" }}>{docs.filter(d => d.status === "processed").reduce((a, d) => a + d.chunks, 0)}</span>
              <span className="stat-label">{t("documents.chunks")}</span>
            </div>
          </div>
        </div>

        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          data-testid="drop-zone"
        >
          <div className="drop-icon">📁</div>
          <div className="drop-title">{t("documents.dropZoneTitle")}</div>
          <div className="drop-subtitle">{t("documents.dropZoneSub")}</div>
          <div className="format-tags">
            {["PDF", "DOCX", "TXT", "CSV", "XLSX"].map(f => (
              <span key={f} className="format-tag">{f}</span>
            ))}
          </div>
          <button className="upload-btn" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
            + {t("documents.uploadBtn")}
          </button>
        </div>

        <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.csv" multiple style={{ display: "none" }}
          onChange={e => {
            Array.from(e.target.files || []).forEach(file => {
              setDocs(d => [...d, { id: Date.now() + Math.random(), name: file.name, size: `${(file.size/1024/1024).toFixed(1)} MB`, chunks: 0, status: "processing", date: "Just now" }]);
            });
          }}
        />

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t("documents.uploadedDocuments")}</h3>
            <span className="file-count">{docs.length} {docs.length !== 1 ? t("documents.files") : t("documents.file")}</span>
          </div>

          {docs.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📄</span>
              <p className="empty-text">{t("documents.noDocsYet")}</p>
            </div>
          ) : (
            <div className="docs-list">
              {docs.map((doc, i) => (
                <div key={doc.id} className="doc-item" style={{ animationDelay: `${i * 0.04}s` }} data-testid={`document-${doc.id}`}>
                  <div className="doc-icon">
                    {doc.name.endsWith(".pdf") ? "📄" : doc.name.endsWith(".docx") ? "📝" : "📋"}
                  </div>
                  <div className="doc-content">
                    <div className="doc-name">{doc.name}</div>
                    <div className="doc-meta">
                      <span>{doc.size}</span>
                      <span className="divider">·</span>
                      <span>{doc.status === "processed" ? `${doc.chunks} ${t("documents.chunks")}` : t("documents.processing") + "…"}</span>
                      <span className="divider">·</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <span className={`status-badge ${doc.status}`}>
                      {doc.status === "processed" ? "✓ " + t("documents.ready") : "⏳ " + t("documents.processing")}
                    </span>
                    <button className="action-btn" title={t("documents.reprocess")} data-testid={`button-reprocess-${doc.id}`}>↺</button>
                    <button className="action-btn danger" onClick={() => deleteDoc(doc.id)} title={t("common.delete")} data-testid={`button-delete-${doc.id}`}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tips-card">
          <h4 className="tips-title">💡 {t("documents.tipsTitle")}</h4>
          <div className="tips-grid">
            {tips.map((tip, i) => (
              <div key={i} className="tip-item">
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-text">{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const css = `
  .docs-page {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    font-family: 'Inter', sans-serif;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .page-title {
    font-size: 2rem;
    font-weight: 800;
    color: #f3f4f6;
    letter-spacing: -0.025em;
    line-height: 1.2;
    margin: 0 0 0.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
    color: #9ca3af;
    margin: 0;
  }

  .stats-row {
    display: flex;
    gap: 0.75rem;
  }

  .stat-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 12px;
    padding: 0.75rem 1.125rem;
    min-width: 90px;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .drop-zone {
    border: 2px dashed #374151;
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #111827;
  }

  .drop-zone:hover,
  .drop-zone.dragging {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
  }

  .drop-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .drop-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin-bottom: 0.5rem;
  }

  .drop-subtitle {
    font-size: 0.9375rem;
    color: #9ca3af;
    margin-bottom: 1.25rem;
  }

  .format-tags {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .format-tag {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.375rem 0.75rem;
    border-radius: 8px;
    background: #1f2937;
    color: #9ca3af;
    border: 1px solid #374151;
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: linear-gradient(135deg, #10b981, #059669);
    color: #ffffff;
    border: none;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 700;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
  }

  .upload-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  }

  .card {
    background: #111827;
    border: 1px solid #1f2937;
    border-radius: 16px;
    overflow: hidden;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #1f2937;
  }

  .card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0;
  }

  .file-count {
    font-size: 0.875rem;
    color: #9ca3af;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4rem 2rem;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
  }

  .docs-list {
    display: flex;
    flex-direction: column;
  }

  .doc-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.125rem 1.5rem;
    border-bottom: 1px solid #1f2937;
    transition: background 0.2s;
    animation: fadeUp 0.4s ease both;
  }

  .doc-item:last-child {
    border-bottom: none;
  }

  .doc-item:hover {
    background: #1f2937;
  }

  .doc-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .doc-content {
    flex: 1;
  }

  .doc-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #f3f4f6;
    margin-bottom: 0.25rem;
  }

  .doc-meta {
    font-size: 0.8125rem;
    color: #9ca3af;
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .divider {
    color: #6b7280;
  }

  .doc-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .status-badge {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.375rem 0.75rem;
    border-radius: 100px;
    letter-spacing: 0.03em;
  }

  .status-badge.processed {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .status-badge.processing {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .action-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #1f2937;
    border: 1px solid #374151;
    color: #9ca3af;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn:hover {
    color: #f3f4f6;
    border-color: #4b5563;
    background: #374151;
  }

  .action-btn.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
  }

  .tips-card {
    background: rgba(16, 185, 129, 0.05);
    border: 1px solid rgba(16, 185, 129, 0.15);
    border-radius: 16px;
    padding: 1.75rem;
  }

  .tips-title {
    font-size: 1rem;
    font-weight: 700;
    color: #f3f4f6;
    margin: 0 0 1.25rem;
  }

  .tips-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (max-width: 900px) {
    .tips-grid {
      grid-template-columns: 1fr;
    }
  }

  .tip-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .tip-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .tip-text {
    font-size: 0.875rem;
    color: #d1d5db;
    line-height: 1.6;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
