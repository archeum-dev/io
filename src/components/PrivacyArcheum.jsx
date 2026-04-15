export default function PrivacyArcheum() {
  return (
    <div style={{
      padding: '2rem',
      margin: '0 auto',
      maxWidth: '800px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '1rem',
      lineHeight: '1.7',
      color: '#e0e0e0',
      background: '#1a1a1a',
      minHeight: '100vh',
    }}>
      <h1>Privacy Policy — Archeum</h1>
      <p><em>Last updated: April 15, 2026</em></p>

      <h2>Overview</h2>
      <p>
        Archeum is a decentralized personal infrastructure app. It is the wallet
        and key-management app for the Archeum network. The app stores
        cryptographic keys and identity data on your device and on infrastructure
        (a &quot;node&quot;) that <strong>you own and control</strong>. Archeum the publisher does not
        operate servers that receive or store your data.
      </p>

      <h2>Data stored on your device</h2>
      <p>
        The app stores the following locally, in Android&apos;s encrypted secure storage:
      </p>
      <ul>
        <li>Your wallet private key (secp256k1) and mnemonic phrase</li>
        <li>Your AGE encryption keypair</li>
        <li>Your Archeum handle(s) and associated node endpoint(s)</li>
        <li>App settings and preferences</li>
      </ul>
      <p>
        These values never leave your device, except as described below.
      </p>

      <h2>Data sent over the network</h2>
      <ul>
        <li>
          <strong>Blockchain reads</strong>: to resolve Archeum handles, the app
          queries the Base network (a public Ethereum Layer 2). Reads are
          anonymous but your IP address is visible to the RPC provider.
        </li>
        <li>
          <strong>Blockchain writes</strong> (handle registration): the app
          submits signed transactions to Base. These transactions are
          publicly visible on-chain and contain your wallet address.
        </li>
        <li>
          <strong>Gas sponsorship</strong> (optional): for first-time handle
          registration, the app may submit a sponsored transaction through a
          third-party bundler (Pimlico). The bundler sees your wallet address
          and registration data but does not store personal identifiers beyond
          standard RPC logs.
        </li>
        <li>
          <strong>Your node</strong>: the app connects to the node you own over
          QUIC (UDP 443) to read and write your data. Data sent to your node is
          under your control.
        </li>
      </ul>

      <h2>Data we (the publisher) receive</h2>
      <p>
        By default, we receive <strong>nothing</strong>. No analytics, no telemetry,
        no crash reporting, no ad tracking.
      </p>
      <p>
        If you tap <em>Settings → Send Feedback</em>, the app opens the system
        share sheet (or email app) with recent debug logs (up to ~50 KB,
        normally kept only in memory; briefly written to a temp file for the
        share sheet attachment, cleaned up by the OS) addressed to{' '}
        <code>contact@archeum.io</code>. Nothing is sent unless you choose to
        send it.
      </p>

      <h2>Permissions</h2>
      <ul>
        <li><strong>Internet</strong>: connect to your node and the blockchain.</li>
        <li><strong>Bluetooth</strong>: provision a nearby Archeum node (first-time setup). Local-only; no data is transmitted over the internet via Bluetooth.</li>
        <li><strong>Fine Location</strong>: Android requires it to scan for Bluetooth devices during node provisioning. We do not read, store, or transmit your location.</li>
      </ul>

      <h2>Local network communication</h2>
      <p>
        During first-time node provisioning, the app may talk to a node on your
        local network using plaintext HTTP (e.g. <code>http://[::1]:8080</code>).
        This traffic never leaves the local network. Once provisioned, all
        communication with your node uses encrypted QUIC (TLS 1.3) over the
        internet.
      </p>

      <h2>Third parties</h2>
      <ul>
        <li><strong>Base (Coinbase)</strong> — public blockchain used for handle registration.</li>
        <li><strong>Pimlico</strong> — optional bundler/paymaster for sponsored transactions.</li>
        <li><strong>Google Play Services</strong> — for app distribution and (in future releases) Play Integrity device attestation.</li>
      </ul>

      <h2>Children</h2>
      <p>Archeum is not intended for users under 18.</p>

      <h2>Changes to this policy</h2>
      <p>
        When this policy changes materially, we will update the date at the top
        and highlight changes in the app&apos;s release notes.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: <a href="mailto:contact@archeum.io" style={{color: '#8ab4ff'}}>contact@archeum.io</a>
      </p>
    </div>
  )
}
