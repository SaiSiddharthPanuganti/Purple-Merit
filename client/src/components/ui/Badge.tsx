interface BadgeProps {
  children: string;
  colorClass: string;
}

export default function Badge({ children, colorClass }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {children}
    </span>
  );
}
