function RoleButton({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 flex cursor-pointer flex-col items-center gap-1 rounded-xl px-3 py-3 text-center transition-all ${
        active ? "bg-white text-brand-800 shadow-soft ring-1 ring-brand-500/20" : "text-ink/55 hover:text-brand-700"
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] opacity-70">{sub}</span>
    </button>
  );
}

export default RoleButton;