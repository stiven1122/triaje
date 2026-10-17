interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function CuacLogo({ className = "", size = "md" }: Props) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <svg
      className={`${sizes[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Corporación Universitaria Autónoma del Cauca"
    >
      {/* Escudo base */}
      <path
        d="M50 5 L85 20 L85 55 C85 75 70 90 50 95 C30 90 15 75 15 55 L15 20 L50 5Z"
        fill="#003399"
        stroke="#FFD700"
        strokeWidth="2"
      />
      {/* Libro - símbolo de educación */}
      <rect x="25" y="35" width="50" height="35" rx="2" fill="#FFFFFF" />
      <rect x="28" y="38" width="44" height="3" fill="#003399" />
      <rect x="28" y="45" width="44" height="2" fill="#003399" />
      <rect x="28" y="50" width="44" height="2" fill="#003399" />
      <rect x="28" y="55" width="44" height="2" fill="#003399" />
      <rect x="28" y="60" width="30" height="2" fill="#003399" />
      {/* Pluma */}
      <path
        d="M70 30 L75 25 L78 28 L73 33 Z"
        fill="#FFD700"
        stroke="#003399"
        strokeWidth="1"
      />
      <path
        d="M70 30 L65 55 L68 58 L73 33"
        fill="#FFD700"
        stroke="#003399"
        strokeWidth="1"
      />
      {/* Corona o laurel - símbolo de excelencia */}
      <circle cx="50" cy="25" r="5" fill="#FFD700" />
      <path
        d="M45 20 L40 15 M55 20 L60 15 M50 18 L50 12"
        stroke="#FFD700"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
