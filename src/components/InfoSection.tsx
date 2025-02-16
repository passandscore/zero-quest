export function InfoSection() {
  return (
    <div className="w-full p-6 bg-green-500/5 border border-green-500/20">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg mb-2">{'>'} MISSION_BRIEFING.txt</h3>
          <p className="text-sm text-green-400 leading-relaxed">
            {'>'} TARGET: Generate private key for 0x0000...0000<br/>
            {'>'} STATUS: Not impossible. Highly improbable.<br/>
            {'>'} ODDS: 1 in 2¹⁶⁰
          </p>
        </div>
        
        <div>
          <h3 className="text-lg mb-2">{'>'} HOW_IT_WORKS.md</h3>
          <div className="text-sm text-green-400 leading-relaxed space-y-2">
            <p>{'>'} 1. Generate random private key</p>
            <p>{'>'} 2. Derive Ethereum address</p>
            <p>{'>'} 3. Count leading zeros</p>
            <p>{'>'} 4. Calculate match percentage</p>
            <p>{'>'} 5. Save if better than previous</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-2">{'>'} TECHNICAL_DETAILS.txt</h3>
          <div className="text-sm text-green-400 leading-relaxed space-y-2">
            <p>{'>'} Private Key: 32 bytes (256 bits)</p>
            <p>{'>'} Address: 20 bytes (160 bits)</p>
            <p>{'>'} Match: Leading zero bits / 160 * 100</p>
          </div>
        </div>
      </div>
    </div>
  );
} 