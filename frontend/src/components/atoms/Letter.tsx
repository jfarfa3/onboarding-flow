import type { LetterProps } from "@/types/letter";

export default function Letter({
  letter,
  firstLetter,
}: LetterProps) {
  return (
    <p className={`border border-blue-600 text-xl font-bold p-2 ${!firstLetter ? "bg-blue-500 text-white" : "bg-white text-black"}`} >
      {letter}
    </p>
  );
}
