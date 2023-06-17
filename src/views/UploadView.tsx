import React from "react";

export default function UploadView() {
  return (
    <>
      <h1 className="mb-4">Upload de arquivo de remessa</h1>
      <form className="flex items-center space-x-6">
        <label className="block">
          <input
            type="file"
            className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100
          "
          />
        </label>
      </form>
    </>
  );
}
