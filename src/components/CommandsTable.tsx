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
        { key: 'CTRL+S', description: 'Share progress' },
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
      ]
    }
  ];

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-4 font-mono text-base">
        <div className="text-[#33ff00] mb-4">{'>'} cat COMMANDS.txt</div>
        {commandGroups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? 'mt-4' : ''}>
            <div className="text-[#33ff00] opacity-70 mb-1">{`// ${group.title}`}</div>
            {group.commands.map(({ key, description }) => (
              <div key={key} className="grid grid-cols-[100px_1fr] gap-4 text-sm">
                <span className="text-[#33ff00]">{key}</span>
                <span className="text-[#33ff00]">{description}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
} 