import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getStudentIdentityBlob,
  getStudentPhotoBlob,
} from "../api/fileApi";
import SecureImage from "./common/SecureImage";

const openBlob = (blob, fallbackName) => {
  const blobUrl = URL.createObjectURL(blob);
  const opened = window.open(blobUrl, "_blank", "noopener,noreferrer");

  if (!opened) {
    toast.error("Popup blocked. Please allow popups and try again.");
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
};

const downloadBlob = (blob, fileName) => {
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
};

const StudentDocuments = ({ studentId }) => {
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [openingPhoto, setOpeningPhoto] = useState(false);
  const [openingIdentity, setOpeningIdentity] = useState(false);
  const [downloadingPhoto, setDownloadingPhoto] = useState(false);
  const [downloadingIdentity, setDownloadingIdentity] = useState(false);

  const photoSrc = useMemo(
    () => `/files/student/${studentId}/photo`,
    [studentId],
  );

  const openPhotoInNewTab = async () => {
    try {
      setOpeningPhoto(true);
      const blob = await getStudentPhotoBlob(studentId);
      openBlob(blob, `student-${studentId}-photo`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to open photo.");
    } finally {
      setOpeningPhoto(false);
    }
  };

  const openIdentityInNewTab = async () => {
    try {
      setOpeningIdentity(true);
      const blob = await getStudentIdentityBlob(studentId);
      openBlob(blob, `student-${studentId}-identity`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to open identity document.",
      );
    } finally {
      setOpeningIdentity(false);
    }
  };

  const downloadPhoto = async () => {
    try {
      setDownloadingPhoto(true);
      const blob = await getStudentPhotoBlob(studentId);
      downloadBlob(blob, `student-${studentId}-photo`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to download photo.");
    } finally {
      setDownloadingPhoto(false);
    }
  };

  const downloadIdentity = async () => {
    try {
      setDownloadingIdentity(true);
      const blob = await getStudentIdentityBlob(studentId);
      downloadBlob(blob, `student-${studentId}-identity`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to download identity document.",
      );
    } finally {
      setDownloadingIdentity(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-lg font-semibold text-slate-900">Student Documents</h3>
      <p className="mt-1 text-sm text-slate-600">
        Preview profile photo and open identity document securely.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">Profile Photo</p>
          <div className="h-44 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <SecureImage
              src={photoSrc}
              alt="Student profile"
              className="h-full w-full cursor-zoom-in object-cover"
              fallback={
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                  Photo not available
                </div>
              }
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPhotoPreviewOpen(true)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={openPhotoInNewTab}
              disabled={openingPhoto}
              className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {openingPhoto ? "Opening..." : "Open Photo"}
            </button>
            <button
              type="button"
              onClick={downloadPhoto}
              disabled={downloadingPhoto}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              {downloadingPhoto ? "Downloading..." : "Download Photo"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="mb-2 text-sm font-semibold text-slate-700">Identity Document</p>
          <p className="text-sm text-slate-600">
            Open the identity document in a new tab, or use a separate download action.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={openIdentityInNewTab}
              disabled={openingIdentity}
              className="rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {openingIdentity ? "Opening..." : "Open Identity"}
            </button>
            <button
              type="button"
              onClick={downloadIdentity}
              disabled={downloadingIdentity}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              {downloadingIdentity ? "Downloading..." : "Download Identity"}
            </button>
          </div>
        </div>
      </div>

      {photoPreviewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-900">Profile Photo Preview</h4>
              <button
                type="button"
                onClick={() => setPhotoPreviewOpen(false)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              <SecureImage
                src={photoSrc}
                alt="Student profile preview"
                className="h-[60vh] w-full object-contain"
                fallback={
                  <div className="flex h-[40vh] w-full items-center justify-center text-sm text-slate-500">
                    Photo not available
                  </div>
                }
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentDocuments;
