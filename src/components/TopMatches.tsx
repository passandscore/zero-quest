import { FaCopy } from "react-icons/fa";

interface TopMatchesProps {
  copyToClipboard: (text: string, id: string) => void;
  copyingId: string | null;
  copyNotification: string | null;
}

export function TopMatches({ copyToClipboard, copyingId, copyNotification }: TopMatchesProps) {
  const topMatches = [
    { address: "0x0000000000000000000000000000000000000001", percentage: 15.625, privateKey: "0x123..." },
    { address: "0x0000000000000000000000000000000000000002", percentage: 12.5, privateKey: "0x456..." },
    // Add more example matches as needed
  ];

  return (
    <div className="w-full p-6 bg-green-500/5 border border-green-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg">{'>'} TOP_MATCHES.log</h3>
        {copyNotification && (
          <span className="text-sm bg-green-500/10 border border-green-500/50 px-4 py-1 animate-fade-up">
            {copyNotification}
          </span>
        )}
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-green-500/20">
            <th className="py-2 px-4 text-left text-green-400">#</th>
            <th className="py-2 px-4 text-left text-green-400">Address</th>
            <th className="py-2 px-4 text-right text-green-400">Match</th>
            <th className="py-2 px-4 text-right text-green-400">Key</th>
          </tr>
        </thead>
        <tbody>
          {topMatches.map((match, index) => (
            <tr key={match.address} className="border-t border-green-500/20">
              <td className="py-3 px-4 text-green-400">#{index + 1}</td>
              <td className="py-3 px-4 text-sm font-mono">{match.address}</td>
              <td className="py-3 px-4 text-sm text-right">{match.percentage.toFixed(3)}%</td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => copyToClipboard(match.privateKey, match.address)}
                    className="w-[32px] h-[32px] bg-green-500/10 hover:bg-green-500/20 transition-all flex items-center justify-center"
                  >
                    {copyingId === match.address ? (
                      <span className="text-xs">OK_</span>
                    ) : (
                      <FaCopy size={12} />
                    )}
                  </button>
                  <span className="text-green-500/50 text-xs">[C]</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 