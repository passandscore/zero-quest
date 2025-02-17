import { Modal } from './Modal';

interface CommandsTableProps {
  show: boolean;
  onClose: () => void;
}

export function CommandsTable({ show, onClose }: CommandsTableProps) {
  const commands = [
    { key: 'SPACE', description: 'Start/Stop generating addresses' },
    { key: 'CTRL+R', description: 'Reset everything' },
    { key: 'C', description: 'Copy focused content' },
    { key: '0-9', description: 'Copy private key from top matches' },
    { key: 'CTRL+V', description: 'View vault balance' },
    { key: 'ESC', description: 'Close modals' },
    { key: 'CTRL+S', description: 'Share your progress' },
  ];

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-4 font-mono text-base">
        <div className="text-[#33ff00] mb-4">
          {'>'} cat COMMANDS.txt
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#33ff00]">
              <th className="px-4 py-1 text-left text-[#33ff00] font-normal">#</th>
              <th className="px-4 py-1 text-left text-[#33ff00] font-normal">COMMAND</th>
              <th className="px-4 py-1 text-left text-[#33ff00] font-normal">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(({ key, description }, index) => (
              <tr key={key} className="border-t border-green-500/10">
                <td className="px-4 py-1 text-[#33ff00]">{index}</td>
                <td className="px-4 py-1 text-[#33ff00]">[{key}]</td>
                <td className="px-4 py-1 text-[#33ff00]">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
} 