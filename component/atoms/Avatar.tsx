import Image from "next/image"

interface AvatarProps {
  src: string
  alt: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  }

  const sizeValues = {
    sm: 48,
    md: 80,
    lg: 96,
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gray-200 ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={sizeValues[size]}
        height={sizeValues[size]}
        className="w-full h-full object-cover"
        unoptimized={src.includes(".svg")}
      />
    </div>
  )
}
