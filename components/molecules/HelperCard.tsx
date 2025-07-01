import Link from 'next/link';

interface HelperCardProps {
  id: string;
  name: string;
  title?: string;
  status?: 'available' | 'busy' | 'offline';
  specialty?: string;
  avatar: string;
}

export function HelperCard({
  id,
  name,
  title = 'Helper disponible',
  status = 'available',
  specialty,
  avatar,
}: HelperCardProps) {
  const statusColors = {
    available:
      'bg-success-green/10 text-success-green dark:bg-success-green/20',
    busy: 'bg-royal-blue/10 text-royal-blue dark:bg-royal-blue/20',
    offline: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  const statusDots = {
    available: 'bg-success-green',
    busy: 'bg-royal-blue',
    offline: 'bg-gray-400',
  };

  return (
    <Link href={`/helper/${id}`}>
      <div className="bg-white dark:bg-blue-gray-dark rounded-lg shadow-lg p-6 h-64 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group border border-light-blue-gray/20 dark:border-royal-blue/30">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-light-blue-gray to-royal-blue/20 dark:from-blue-gray-dark dark:to-royal-blue/40 rounded-full flex items-center justify-center group-hover:from-royal-blue/20 group-hover:to-royal-blue/40 transition-all duration-300">
              <img
                src={avatar || '/placeholder.svg'}
                alt={name}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 ${statusDots[status]} rounded-full border-2 border-white dark:border-blue-gray-dark`}
            ></div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-semibold text-primary-text dark:text-dark-base-text">
              {name}
            </h3>
            <p className="text-sm font-medium text-royal-blue">{title}</p>
            {specialty && (
              <p className="text-sm text-primary-text/70 dark:text-dark-base-text/70">
                {specialty}
              </p>
            )}
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
            >
              {status === 'available'
                ? 'Disponible'
                : status === 'busy'
                  ? 'Occupé'
                  : 'Hors ligne'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
