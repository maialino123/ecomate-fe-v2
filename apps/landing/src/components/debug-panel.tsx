"use client";
import { useState } from "react";

interface DebugInfo {
  modelSize?: { x: number; y: number; z: number };
  modelCenter?: { x: number; y: number; z: number };
  cameraPosition?: { x: number; y: number; z: number };
}

export function DebugPanel({ info }: { info: DebugInfo }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 px-4 py-2 bg-emerald-600 text-white rounded-lg shadow-lg hover:bg-emerald-700"
      >
        Show Debug Info
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 text-white p-4 rounded-lg shadow-xl max-w-md font-mono text-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-emerald-400">🔍 Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {info.modelSize && (
          <div>
            <div className="text-emerald-300 font-semibold">Model Size:</div>
            <div className="pl-2 text-white/80">
              x: {info.modelSize.x.toFixed(2)}<br/>
              y: {info.modelSize.y.toFixed(2)}<br/>
              z: {info.modelSize.z.toFixed(2)}
            </div>
          </div>
        )}

        {info.modelCenter && (
          <div>
            <div className="text-emerald-300 font-semibold">Model Center:</div>
            <div className="pl-2 text-white/80">
              x: {info.modelCenter.x.toFixed(2)}<br/>
              y: {info.modelCenter.y.toFixed(2)}<br/>
              z: {info.modelCenter.z.toFixed(2)}
            </div>
          </div>
        )}

        {info.cameraPosition && (
          <div>
            <div className="text-emerald-300 font-semibold">Camera Position:</div>
            <div className="pl-2 text-white/80">
              x: {info.cameraPosition.x.toFixed(2)}<br/>
              y: {info.cameraPosition.y.toFixed(2)}<br/>
              z: {info.cameraPosition.z.toFixed(2)}
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="text-emerald-300 font-semibold mb-1">Controls:</div>
          <div className="text-white/60 text-xs space-y-1">
            <div>• Left Click + Drag: Rotate</div>
            <div>• Right Click + Drag: Pan</div>
            <div>• Scroll: Zoom</div>
            <div>• Press P: Log position to browser console</div>
          </div>
        </div>
      </div>
    </div>
  );
}
