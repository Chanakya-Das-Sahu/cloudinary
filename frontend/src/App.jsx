import { useEffect, useState } from "react";
import { getBasePath} from "../utils/getBasePath";

export default function CloudinaryGallery() {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [activeFolder, setActiveFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
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
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const askDelete = (public_id) => setDeleteTarget(public_id);

 const confirmDelete = async () => {
  if (!deleteTarget) return;

  await fetch(`${getBasePath()}/delete?public_id=${encodeURIComponent(deleteTarget)}`, {
    method: "DELETE",
  });

  setDeleteTarget(null);
  loadImages(activeFolder);
};


  return (
    <div className="p-6 space-y-6">
      {/* FOLDER SELECTION */}
      <div className="flex flex-wrap gap-3">
        {folders.map((f) => (
          <button
            key={f.name}
            onClick={() => loadImages(f.name)}
            className={`px-4 py-2 rounded border 
              ${activeFolder === f.name ? "bg-gray-800 text-white" : "bg-white"}
            `}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* UPLOAD AREA */}
      {activeFolder && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded p-4 text-center w-64 mx-auto"
        >
          Drag & drop here to upload into <b>{activeFolder}</b>
          <div className="mt-3">
            <input
              type="file"
              onChange={(e) => handleUpload(e.target.files[0])}
              className="block mx-auto"
            />
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center w-full py-8 text-lg animate-pulse">
          Loading images...
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.public_id}
              className="shadow rounded overflow-hidden relative group"
            >
              <img
                src={img.secure_url}
                alt={img.public_id}
                className="w-full h-auto"
              />

              {/* LEFT HALF — DELETE */}
              <div
                className="absolute top-0 left-0 w-1/2 h-full cursor-pointer"
                onClick={() => askDelete(img.public_id)}
              />

              {/* RIGHT HALF — OPEN IN NEW TAB */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full cursor-pointer"
                onClick={() => window.open(img.secure_url, "_blank")}
              />
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center"
        onClick={() => setDeleteTarget(null)}
        >
          <div className="bg-white p-6 rounded shadow space-y-4"
        >
            <p>Are you sure you want to delete this image?</p>
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
