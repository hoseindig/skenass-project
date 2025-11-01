interface Props {
  variant?: "primary" | "outline";
  size?: "sm" | "md";
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  onClick,
  children,
}: Props) {
  const base =
    "rounded-lg font-medium transition px-4 py-2 flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  const sizes = { sm: "text-sm", md: "text-base" };

  return (
    <button
      className={`${base} ${styles[variant]} ${sizes[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
