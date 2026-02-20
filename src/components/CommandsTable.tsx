import { Modal } from './Modal';

interface CommandsTableProps {
  show: boolean;
  onClose: () => void;
}

export function CommandsTable({ show, onClose }: CommandsTableProps) {
  const commandGroups = [
    {
      title: "Mining Controls",
      commands: [
        { key: 'SPACE', description: 'Start/Stop generating addresses' },
        { key: 'CTRL+R', description: 'Reset all progress' },
      ]
    },
    {
      title: "Data Management",
      commands: [
        { key: 'CTRL+E', description: 'Export progress to file' },
        { key: 'CTRL+I', description: 'Import progress from file' },
        { key: 'CTRL+S', description: 'Post to X' },
      ]
    },
    {
      title: "Clipboard Actions",
      commands: [
        { key: '0-9', description: 'Copy private key from top matches' },
        { key: 'C', description: 'Copy current private key' },
      ]
    },
    {
      title: "Navigation",
      commands: [
        { key: 'CTRL+V', description: 'View vault on Etherscan' },
        { key: 'ESC', description: 'Close any open window' },
        { key: '—', description: 'Leaderboard at /leaderboard' },
      ]
    }
  ];

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-8 text-sm">
        <h2 className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted mb-8">Shortcuts</h2>
        {commandGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? 'mt-8' : ''}>
            <div className="text-[11px] font-medium tracking-widest uppercase text-steam-text-muted mb-3">{group.title}</div>
            {group.commands.map(({ key, description }) => (
              <div key={key} className="grid grid-cols-[100px_1fr] gap-4 py-1.5">
                <span className="text-steam shrink-0 text-[11px] font-medium tracking-wider">{key}</span>
                <span className="text-steam-text break-words">{description}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
} 