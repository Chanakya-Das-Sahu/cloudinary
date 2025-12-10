import { useState, useRef } from "react";

export default function DummyPage({ onUnlock }) {
  // ---- MORSE UNLOCK LOGIC ----
  const regex = import.meta.env.VITE_REGEX.split(","); // your unlock sequence
  const [index, setIndex] = useState(0);
  const pressStart = useRef(null);

  const handleDown = () => {
    pressStart.current = Date.now();
  };

  const handleUp = () => {
    const ms = Date.now() - pressStart.current;
    const signal = ms < 300 ? "." : "-";

    if (signal === regex[index]) {
      const next = index + 1;
      if (next === regex.length) {
        onUnlock();
        setIndex(0);
        return;
      }
      setIndex(next);
    } else {
      setIndex(0);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center pt-24 px-4 select-none"
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onTouchStart={handleDown}
      onTouchEnd={handleUp}
    >
      {/* Fullscreen ESC bar */}

      {/* White card */}
      <div className="bg-white shadow rounded-lg p-8 max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold mb-3 text-gray-900">Site not found</h1>

        <p className="text-gray-700 mb-4 leading-relaxed">
          Looks like you followed a broken link or entered a URL that doesn’t exist on Netlify.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          If this is your site, and you weren’t expecting a 404 for this path, please visit Netlify’s{" "}
         <p
//   href="#"
  className="text-blue-600 underline"
  onClick={() => window.location.reload()}
>
  “page not found” support guide
</p>

          for troubleshooting tips.
        </p>

        <div className="text-gray-700 text-sm">
          Netlify Internal ID:{" "}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded border">
            01KC3R35EWXCTPR7X0QG50Y39Z
          </span>
        </div>
      </div>
    </div>
  );
}



