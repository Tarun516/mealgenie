// components/Spinner.tsx
"use client";

export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin" />
    </div>
  );
}

export default Spinner;
