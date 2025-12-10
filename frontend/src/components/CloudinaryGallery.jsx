import { useEffect, useState } from "react";
import { getBasePath } from "../../utils/getBasePath";

export default function CloudinaryGallery() {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [activeFolder, setActiveFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    console.log('getBasePath', getBasePath());
    fetch(`${getBasePath()}/folders`)
      .then((res) => res.json())
      .then((data) => setFolders(data));
  }, []);

  const loadImages = (folder) => {
    setActiveFolder(folder);
    setLoading(true);

    fetch(`${getBasePath()}/images/${folder}`)
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      });
  };

  const handleUpload = async (file) => {
    if (!activeFolder) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", activeFolder);

    await fetch(`${getBasePath()}/upload`, {
      method: "POST",
      body: formData,
    });

    loadImages(activeFolder);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleUpload(f);
  };

  const confirmDelete = async () => {
    await fetch(
      `${getBasePath()}/delete?public_id=${encodeURIComponent(deleteTarget)}`,
      { method: "DELETE" }
    );

    setDeleteTarget(null);
    loadImages(activeFolder);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Folder buttons */}
      <div className="flex flex-wrap gap-3">
        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => loadImages(f.name)}
            className={`px-4 py-2 rounded border ${
              activeFolder === f.name
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Grid: Upload box + images */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-max">
          {/* Upload card */}
          {activeFolder && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="rounded shadow bg-gray-100 border flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-gray-200"
            >
              <p className="text-center text-sm opacity-70">
                Upload to <b>{activeFolder}</b>
              </p>

              <input
                type="file"
                onChange={(e) => handleUpload(e.target.files[0])}
                className="mt-3 text-sm"
              />
            </div>
          )}

          {/* Image cards */}
          {images.map((img) => (
            <div
              key={img.public_id}
              className="shadow rounded overflow-hidden relative group"
            >
              <img
                src={img.secure_url}
                alt={img.public_id}
                className="w-full h-auto object-contain"
              />

              {/* Left half — delete */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
                onClick={() => setDeleteTarget(img.public_id)}
              />

              {/* Right half — open */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
                onClick={() => window.open(img.secure_url, "_blank")}
              />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center w-full py-8 text-lg animate-pulse">
          Loading images...
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white p-6 rounded shadow space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p>Delete this image?</p>
            <div className="flex gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
