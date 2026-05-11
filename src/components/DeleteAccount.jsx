export default function DeleteAccount() {
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
      <h1>Deleting Your Archeum Account</h1>
      <p><em>Last updated: April 15, 2026</em></p>

      <h2>How Archeum differs from typical apps</h2>
      <p>
        Archeum is a decentralized personal-infrastructure layer. The Archeum
        app is where you create your wallet, register a handle, and manage the
        node that stores your data. <strong>The app publisher does not operate
        any servers that store your data.</strong> There is no central database
        of user accounts for us to delete from.
      </p>
      <p>
        Your Archeum account consists of three parts, each of which you fully control:
      </p>
      <ol>
        <li>
          <strong>Your wallet keys</strong> — stored in encrypted on-device storage on your phone.
        </li>
        <li>
          <strong>Your handle</strong> (e.g. <code>@alice</code>) — registered on a public blockchain (Base).
        </li>
        <li>
          <strong>Your node storage</strong> — raw data stored on your personal
          Archeum node, which you either own outright or have a tenant share
          of on someone else&apos;s node. Third-party Archeum apps (like Social)
          write their data here on your behalf, each in its own isolated
          namespace.
        </li>
      </ol>

      <h2>How to delete your account</h2>
      <p>
        Because no developer-side record exists, deletion is something you
        perform yourself — directly in the app.
      </p>

      <h3>1. Use the in-app Delete Account flow (recommended)</h3>
      <p>
        Open the Archeum app → Settings → <strong>Delete Account</strong>.
        You&apos;ll be asked to type &quot;delete&quot; as confirmation. Once
        confirmed, the app will:
      </p>
      <ol>
        <li>Wipe all data stored on your node across every app&apos;s namespace.</li>
        <li>Clear all local secure storage (wallet keys, mnemonic, app settings).</li>
        <li>Sign you out.</li>
      </ol>
      <p>
        After deletion completes, you&apos;re returned to the welcome screen.
        Uninstall the app to remove any remaining cache files.
      </p>

      <h3>2. Alternative: manual cleanup</h3>
      <p>
        If you prefer to selectively remove data before deleting your account:
      </p>
      <ul>
        <li>
          <strong>Per-app cleanup</strong>: tap your identity card →
          Storage → Apps tab. For each app, tap <strong>Clear data</strong> to
          delete its stored content.
        </li>
        <li>
          <strong>Node on your own computer</strong>: stop the node and delete
          its data directory (<code>~/.archeum/</code> on Linux/macOS,{' '}
          <code>%LOCALAPPDATA%\archeum\</code> on Windows).
        </li>
        <li>
          <strong>Tenant on someone else&apos;s node</strong>: ask them to
          remove you (Settings → Node Sharing → Remove Tenant), or leave the
          node yourself (Settings → Leave Node). On removal, your data is
          deleted from their node.
        </li>
      </ul>

      <h3>3. Handle dormancy</h3>
      <p>
        Your handle remains registered on the blockchain after account
        deletion — the blockchain is immutable. However, because your node is
        offline and your data is wiped, the handle effectively becomes dormant.
        No one can interact with you through it.
      </p>

      <h2>What data is deleted vs. retained</h2>
      <ul>
        <li>
          <strong>Deleted by the in-app flow</strong>: All data stored on your
          node (every namespace) + all on-device data (wallet keys, mnemonic,
          app settings, secure storage). This happens in a single operation
          when you confirm deletion.
        </li>
        <li>
          <strong>Deleted on uninstall</strong>: Any remaining app cache files
          not covered by the deletion flow.
        </li>
        <li>
          <strong>Cannot be deleted</strong>: On-chain handle registration
          history. The blockchain is immutable by design — past registrations,
          transfers, and challenges remain publicly visible. However, the
          handle points at an emptied, offline node after deletion.
        </li>
      </ul>

      <h2>What the publisher retains</h2>
      <p>
        <strong>Nothing.</strong> The app publisher operates no servers that
        receive or store your data. We cannot delete or retain anything on your
        behalf because we never had it.
      </p>
      <p>
        If you previously sent us a feedback email (Settings → Send Feedback),
        we may retain that email thread in our inbox per normal email practice.
        To request deletion of your feedback email, contact{' '}
        <a href="mailto:contact@archeum.io" style={{color: '#8ab4ff'}}>contact@archeum.io</a>.
      </p>

      <h2>Need help?</h2>
      <p>
        Questions: <a href="mailto:contact@archeum.io" style={{color: '#8ab4ff'}}>contact@archeum.io</a>
      </p>
    </div>
  )
}
