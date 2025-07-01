import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center group">
      <Image
        src="/images/nova_logo.svg"
        alt="NOVA Logo"
        width={160}
        height={160}
        className="w-16 h-16 group-hover:scale-110 transition-transform duration-300 group-hover:drop-shadow-lg"
      />
    </Link>
  );
}
