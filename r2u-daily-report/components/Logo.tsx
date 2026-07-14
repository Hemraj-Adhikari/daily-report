import Image from "next/image";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ${
          compact ? "h-9 w-9" : "h-12 w-12"
        }`}
      >
        <Image
          src="/logo.png"
          alt="Route 2 Uni International Group"
          width={40}
          height={30}
          className="h-auto w-full"
          priority
        />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-semibold text-[var(--nav-fg)]">
          Route 2 Uni
        </div>
        <div className="font-label text-[10px] text-[var(--gold)]">
          DAILY OPS BOARD
        </div>
      </div>
    </div>
  );
}
