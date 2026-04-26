import React from "react";

function UploadImagePopUp({
  formData,
  setFormData,
  photoUrl,
  onClose,
  handleImgUpload,
}) {
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const uploaded = await handleImgUpload(file);

    if (uploaded) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-blue-100 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Profile image
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-800">
              Upload or paste an image
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Choose a file from your device or paste an image link to update
              your profile photo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close image upload popup"
          >
            Close
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
          <img
            src={formData.profileUrl.trim() || photoUrl}
            alt="Profile preview"
            className="mx-auto h-48 w-full max-w-sm rounded-xl object-cover shadow-sm"
          />
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="profileImageUrlPopup"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Image URL
            </label>
            <input
              id="profileImageUrlPopup"
              type="url"
              value={formData.profileUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  profileUrl: e.target.value,
                }))
              }
              placeholder="https://example.com/photo.jpg"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label
              htmlFor="profileImageFile"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Upload from device
            </label>
            <input
              id="profileImageFile"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="block w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadImagePopUp;
