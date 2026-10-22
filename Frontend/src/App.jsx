import { useRef, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/files/research";

function Icon({ name, size = 20, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m-5 5 5-5 5 5" />
        <path d="M20 16.5v3A1.5 1.5 0 0 1 18.5 21h-13A1.5 1.5 0 0 1 4 19.5v-3" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: (
      <>
        <path d="M7 17 17 7M7 7h10v10" />
      </>
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5" />
        <path d="M5 17v4h14v-4" />
      </>
    ),
    alert: (
      <>
        <path d="M12 3 2.8 20h18.4L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </>
    ),
  };

  return <svg {...common}>{paths[name] || paths.file}</svg>;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function App() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState("idle");
  const [report, setReport] = useState("");
  const [error, setError] = useState("");
  const [reportId, setReportId] = useState("");
  const [originalName, setOriginalName] = useState("");
  
  const isProcessing = status === "uploading" || status === "processing";
  const isComplete = status === "completed";

  function chooseFile(selectedFile) {
    if (!selectedFile) return;
    setError("");
    setReport("");
    setReportId("");
    setOriginalName("");

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setStatus("idle");
      setError("Only PDF documents are supported. Please choose a .pdf file.");
      return;
    }

    if (selectedFile.size === 0) {
      setFile(null);
      setStatus("idle");
      setError("This file is empty. Please select a valid PDF.");
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setFile(null);
      setStatus("idle");
      setError("The PDF exceeds the 20 MB upload limit.");
      return;
    }

    setFile(selectedFile);
    setStatus("ready");
  }

  async function summarizeDocument() {
    if (!file || isProcessing) return;
    setStatus("uploading");
    setError("");
    setReport("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Unable to process the PDF."
        );
      }

      const reportContent =
        data.report ??
        data.result ??
        data.summary ??
        data.markdown ??
        "";

      if (data.status && data.status !== "completed") {
        throw new Error(data.message || "The report was not completed.");
      }

      if (!reportContent) {
        throw new Error(
          "The server responded, but no report text was returned. Check the API response format."
        );
      }

      setReport(
        typeof reportContent === "string"
          ? reportContent
          : JSON.stringify(reportContent, null, 2)
      );
      setReportId(data.report_id || "");
      setOriginalName(data.original_filename || file.name);
      setStatus("completed");
    } catch (err) {
      setError(
        err.message?.includes("Failed to fetch")
          ? "Cannot connect to FastAPI. Make sure your backend is running at http://127.0.0.1:8000 and CORS allows http://localhost:5173."
          : err.message || "Something went wrong while processing your PDF."
      );
      setStatus("error");
    }
  }

  function resetWorkspace() {
    setFile(null);
    setReport("");
    setError("");
    setReportId("");
    setOriginalName("");
    setStatus("idle");
    if (inputRef.current) inputRef.current.value = "";
  }

  function downloadReport() {
    if (!report) return;
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(originalName || "document").replace(/\.pdf$/i, "")}-summary.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#080b12] text-white selection:bg-cyan-300 selection:text-[#080b12]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-60 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[130px]" />
        <div className="absolute right-[-180px] top-[500px] h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>
      
      <header className="relative z-10 border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button onClick={resetWorkspace} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
              <Icon name="spark" size={22} />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide">
                LUMEN<span className="text-cyan-300">.AI</span>
              </span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Local File Intelligence
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
            <span
              className={`h-2 w-2 rounded-full ${
                isProcessing ? "animate-pulse bg-amber-300" : "bg-emerald-400"
              }`}
            />
            {isProcessing ? "AI processing" : "PDF workspace"}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <section className="pb-14 pt-16 text-center sm:pb-20 sm:pt-24">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200 sm:text-xs">
            <Icon name="spark" size={15} />
            Read less. Understand more.
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[100px]">
            SUMMARIZE
            <span className="mt-2 block text-white">YOUR</span>
            <span className="mt-2 block bg-gradient-to-r from-cyan-200 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DOCUMENT.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Turn lengthy PDFs into clear, structured insights. Upload your document
            and let AI uncover the information that matters.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <Icon name="check" size={15} /> PDF only
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={15} /> AI-powered analysis
            </span>
            <span className="flex items-center gap-2">
              <Icon name="check" size={15} /> Downloadable report
            </span>
          </div>
        </section>

        <section className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                01 / Upload
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                Bring your document to life.
              </h2>
            </div>
            <span className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-500 sm:block">
              MAX 20 MB
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />

          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a PDF document"
            onClick={() => !isProcessing && inputRef.current?.click()}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && !isProcessing) {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isProcessing) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              if (!isProcessing) chooseFile(event.dataTransfer.files?.[0]);
            }}
            className={`group relative cursor-pointer rounded-3xl border border-dashed p-6 transition duration-300 sm:p-10 ${
              dragging
                ? "border-cyan-300 bg-cyan-300/[0.08]"
                : "border-white/[0.16] bg-white/[0.025] hover:border-cyan-300/50 hover:bg-white/[0.04]"
            } ${isProcessing ? "cursor-wait opacity-80" : ""}`}
          >
            <div className="absolute inset-3 rounded-2xl border border-white/[0.035]" />
            <div className="relative flex flex-col items-center text-center">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition ${
                  file
                    ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.045] text-slate-300 group-hover:text-cyan-200"
                }`}
              >
                <Icon name={file ? "file" : "upload"} size={30} />
              </div>

              {file ? (
                <>
                  <h3 className="mt-5 max-w-full break-all text-base font-semibold sm:text-lg">
                    {file.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatSize(file.size)} · PDF document
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs text-emerald-300">
                    <Icon name="check" size={14} /> Document ready
                  </span>
                </>
              ) : (
                <>
                  <h3 className="mt-5 text-lg font-semibold sm:text-xl">
                    Drop your PDF here
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    or click to browse files on your device
                  </p>
                  <span className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-slate-300 transition group-hover:border-cyan-300/30 group-hover:text-cyan-200">
                    Choose PDF file
                  </span>
                </>
              )}
              <p className="mt-5 text-[11px] text-slate-600">
                PDF format · Maximum file size 20 MB
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm leading-6 text-red-200"
            >
              <Icon name="alert" size={19} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={summarizeDocument}
            disabled={!file || isProcessing}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-bold text-[#071018] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40 sm:py-5 sm:text-base"
          >
            {isProcessing ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#071018]/25 border-t-[#071018]" />
                {status === "uploading"
                  ? "Uploading your document..."
                  : "Generating your summary..."}
              </>
            ) : (
              <>
                <Icon name="spark" size={20} />
                Summarize my document
                <Icon name="arrow" size={18} />
              </>
            )}
          </button>

          {isProcessing && (
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                  <Icon name="spark" size={21} className="animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Your document is being analyzed
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    This can take a little time depending on the document.
                  </p>
                </div>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
              </div>
              <div className="mt-4 grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <Icon name="check" size={14} className="text-emerald-300" />{" "}
                  Uploading PDF
                </span>
                <span className="flex items-center gap-2">
                  <Icon
                    name="refresh"
                    size={14}
                    className="animate-spin text-cyan-300"
                  />{" "}
                  Extracting insights
                </span>
                <span className="flex items-center gap-2">
                  <Icon name="spark" size={14} /> Writing report
                </span>
              </div>
            </div>
          )}
        </section>

        {isComplete && (
          <section
            className="mx-auto mt-16 max-w-5xl scroll-mt-8"
            aria-live="polite"
          >
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  02 / Your results
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Your intelligence brief.
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Generated from {originalName || file?.name || "your PDF"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-[#071018] transition hover:bg-cyan-200"
                >
                  <Icon name="download" size={17} /> Download report
                </button>
                <button
                  onClick={resetWorkspace}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06]"
                >
                  <Icon name="refresh" size={17} /> New document
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0c111b]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Icon name="file" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI-generated report</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Markdown · {report.split(/\s+/).filter(Boolean).length}{" "}
                      words
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300">
                  <Icon name="check" size={14} /> Completed
                </span>
              </div>

              <article className="prose prose-invert prose-slate max-w-none break-words px-5 py-7 text-sm leading-7 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white prose-h1:text-3xl prose-h2:mt-8 prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-cyan-100 prose-a:text-cyan-300 sm:px-8 sm:py-9">
                {report.split("\n").map((line, index) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={index} className="h-2" />;
                  if (/^###\s/.test(trimmed))
                    return <h3 key={index}>{trimmed.replace(/^###\s/, "")}</h3>;
                  if (/^##\s/.test(trimmed))
                    return <h2 key={index}>{trimmed.replace(/^##\s/, "")}</h2>;
                  if (/^#\s/.test(trimmed))
                    return <h1 key={index}>{trimmed.replace(/^#\s/, "")}</h1>;
                  if (/^[-*]\s/.test(trimmed))
                    return (
                      <div key={index} className="flex gap-3 py-1">
                        <span className="text-cyan-300">•</span>
                        <span>{trimmed.replace(/^[-*]\s/, "")}</span>
                      </div>
                    );
                  if (/^\d+\.\s/.test(trimmed))
                    return (
                      <div key={index} className="flex gap-3 py-1">
                        <span className="font-semibold text-cyan-300">
                          {trimmed.match(/^\d+/)?.[0]}.
                        </span>
                        <span>{trimmed.replace(/^\d+\.\s/, "")}</span>
                      </div>
                    );
                  if (/^>\s?/.test(trimmed))
                    return (
                      <blockquote
                        key={index}
                        className="border-l-2 border-cyan-300/50 pl-4 italic text-slate-400"
                      >
                        {trimmed.replace(/^>\s?/, "")}
                      </blockquote>
                    );
                  return <p key={index}>{trimmed}</p>;
                })}
              </article>

              {reportId && (
                <div className="border-t border-white/[0.08] px-5 py-4 text-xs text-slate-600 sm:px-7">
                  Report ID:{" "}
                  <span className="font-mono text-slate-400">{reportId}</span>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mx-auto mt-20 max-w-5xl border-t border-white/[0.08] pt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            A simpler way to understand information
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Upload",
                description: "Choose a PDF from your local device.",
                icon: "upload",
              },
              {
                number: "02",
                title: "Analyze",
                description:
                  "Your backend extracts content and generates a report.",
                icon: "spark",
              },
              {
                number: "03",
                title: "Understand",
                description:
                  "Read your results and save the report as Markdown.",
                icon: "check",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-600">
                    {item.number}
                  </span>
                  <Icon name={item.icon} size={20} className="text-cyan-300" />
                </div>
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.07] px-5 py-6 text-center text-xs text-slate-600">
        <span className="font-semibold tracking-wide text-slate-400">
          LUMEN.AI
        </span>
        <span className="mx-2">·</span>
        Local File Researcher &amp; Summarizer
        <span className="mx-2">·</span>
        Built for focused reading
      </footer>
    </div>
  );
}

export default App;