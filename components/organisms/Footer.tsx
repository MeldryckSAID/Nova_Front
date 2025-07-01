import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-royal-blue text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <span className="hover:text-white/80 transition-colors cursor-pointer">
          Mention légales
        </span>
        <div className="flex items-center">
          <Image
            src="/images/nova_logo.svg"
            alt="NOVA Logo"
            width={44}
            height={44}
            className="w-14 h-14 mr-2"
          />
        </div>
        <span className="hover:text-white/80 transition-colors cursor-pointer">
          Contact
        </span>
      </div>
    </footer>
  );
}
