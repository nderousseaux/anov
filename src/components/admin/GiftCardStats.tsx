import { GiftCardStats as GiftCardStatsType } from "./types";

interface GiftCardStatsProps {
  stats: GiftCardStatsType;
}

export function GiftCardStats({ stats }: GiftCardStatsProps) {
  const statsData = [
    {
      label: "Total émis",
      value: stats.totalIssued,
      icon: "gift",
      color: "text-gold",
    },
    {
      label: "Montant actif",
      value: formatCurrency(stats.totalAmount),
      icon: "euro",
      color: "text-green-400",
    },
    {
      label: "Actifs",
      value: stats.active,
      icon: "check-square",
      color: "text-green-400",
    },
    {
      label: "Expirés",
      value: stats.expired,
      icon: "calendar",
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-4 hover:border-gold/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString("fr-FR")
                  : stat.value}
              </p>
            </div>
            <div className={`p-2 rounded-lg bg-background ${stat.color}`}>
              {stat.icon === "gift" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h4" />
                  <path d="M14 6v12" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                </svg>
              )}
              {stat.icon === "euro" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12" />
                  <path d="M4 14h9" />
                  <path d="M18 6v12" />
                  <path d="M6 6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v12" />
                </svg>
              )}
              {stat.icon === "check-square" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              )}
              {stat.icon === "calendar" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}
