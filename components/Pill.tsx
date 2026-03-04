type PillProps = {
  children: string;
  active?: boolean;
  onClick?: () => void;
};

export default function Pill({ children, active, onClick }: PillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        active ? 'bg-ink text-cream' : 'bg-tag text-inkLight hover:bg-border'
      }`}
    >
      {children}
    </button>
  );
}
