import TicTacToe from "@/components/tic-tac-toe";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-light tracking-tight text-white sm:text-6xl">
          Welcome to my world
        </h1>
        <p className="mt-4 text-sm text-white/30">kieranSpace</p>
      </div>

      {/* Tic-Tac-Toe gate */}
      <TicTacToe />

      {/* GitHub link — bottom right */}
      <a
        href="https://github.com/KieranTou-AI/kieranSpace"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-xs text-white/20 hover:text-white/50 transition-colors"
      >
        GitHub
      </a>
    </main>
  );
}
