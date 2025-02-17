import { Modal } from './Modal';

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

export function HelpModal({ show, onClose }: HelpModalProps) {
  if (!show) return null;

  return (
    <Modal isOpen={show} onClose={onClose}>
      <div className="p-4 font-mono text-base">
        <div className="text-[#33ff00] mb-4">
          {'>'} cat HELP.txt
        </div>
        <div className="space-y-4 text-[#33ff00]">
          <p>
            Welcome to Zero Quest - The Hunt for Ethereum&apos;s Zero Address
          </p>
          
          <div className="space-y-2">
            <p>THE ZERO ADDRESS:</p>
            <p className="pl-4">
              The Ethereum zero address (0x0000000000000000000000000000000000000000) is a mysterious 
              and significant address in the Ethereum ecosystem. It&apos;s commonly used as a burn address 
              and holds millions in lost or deliberately burned tokens.
            </p>
          </div>

          <div className="space-y-2">
            <p>THE QUEST:</p>
            <p className="pl-4">
              Finding the private key to the zero address is considered practically impossible, 
              with odds comparable to winning multiple global lotteries simultaneously. However, 
              it&apos;s not mathematically impossible - just highly improbable.
            </p>
          </div>

          <div className="space-y-2">
            <p>HOW IT WORKS:</p>
            <ul className="pl-4 space-y-1">
              <li>1. Press SPACE to start generating random private keys</li>
              <li>2. Each key generates an Ethereum address</li>
              <li>3. The program calculates how close each address is to the zero address</li>
              <li>4. Top matches are saved for verification</li>
              <li>5. Use CTRL+V to check zero address balance (open etherscan)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p>SECURITY NOTE:</p>
            <p className="pl-4">
              All computation happens locally in your browser. Private keys are never stored or transmitted.
              This is a mathematical pursuit - any discovered private key would be a breakthrough in cryptography.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
} 