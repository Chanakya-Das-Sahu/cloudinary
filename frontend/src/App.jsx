import { useState } from "react";
import CloudinaryGallery from "./components/CloudinaryGallery";
import DummyPage from "./components/DummyPage";

export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen">
      {unlocked ? (
        <CloudinaryGallery />
      ) : (
        <DummyPage onUnlock={() => setUnlocked(true)} />
      )}
    </div>
  );
}
