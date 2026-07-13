"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus({
        type: "success",
        message: `Success! ${data.candidate.name} has been parsed and ranked with an AI score of ${data.score}%.`,
      });
      setFile(null);
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Failed to process the resume layout.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Upload Resume Portal</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Submit application documents to run structural profile evaluations and AI matching engines.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="border-2 border-dashed border-zinc-800 rounded-2xl bg-[#030303] p-12 text-center hover:border-zinc-700 transition-all relative group">
         <input
  type="file"
  accept=".pdf"
  hidden
  onChange={(e) => {
    console.log("WORKING");
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  }}
/>
          <label
  htmlFor="resume-upload"
  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 bg-[#030303] p-12 text-center transition hover:border-zinc-700"
>
  <input
    id="resume-upload"
    type="file"
    accept=".pdf"
    className="hidden"
    onChange={(e) => {
      console.log("WORKING");

      if (e.target.files?.[0]) {
        setFile(e.target.files[0]);
        setStatus(null);
      }
    }}
  />

  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950">
    <UploadCloud className="h-6 w-6 text-zinc-400" />
  </div>

  {file ? (
    <>
      <p className="mt-4 text-white font-medium">{file.name}</p>
      <p className="text-xs text-zinc-500">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </>
  ) : (
    <>
      <p className="mt-4 text-white font-medium">
        Click to select a PDF
      </p>
      <p className="text-xs text-zinc-500">
        PDF only
      </p>
    </>
  )}
</label>
        </div>

        {file && (
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white font-medium text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing Document Architecture..." : "Process & Rank Profile"}
          </button>
        )}
      </form>

      {status && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            status.type === "success"
              ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
              : "bg-rose-500/5 border-rose-500/10 text-rose-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}
    </div>
  );
}