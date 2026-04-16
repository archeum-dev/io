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
        Because no developer-side record exists, deletion is something you perform yourself.
      </p>

      <h3>1. Clear data from your node</h3>
      <p>
        Any Archeum apps you&apos;ve used have stored data on your node, each in
        its own namespace. The fastest way to clear it all:
      </p>
      <ul>
        <li>
          <strong>In the Archeum app</strong>: tap your identity card →
          Storage → Apps tab. For each app, tap <strong>Clear data</strong> to
          delete its stored content, or <strong>Revoke</strong> to remove the
          app&apos;s access to your identity (or both, to fully wipe its
          footprint).
        </li>
        <li>
          <strong>Node on your own computer</strong>: you can also stop the
          node and delete its data directory directly (<code>~/.archeum/</code>{' '}
          on Linux/macOS, <code>%LOCALAPPDATA%\archeum\</code> on Windows).
          Restarting with an empty directory wipes all stored data in one
          action.
        </li>
        <li>
          <strong>Node hosted by another user (tenant model)</strong>: ask them
          to remove you via their Archeum app (Settings → Node Sharing →
          Remove Tenant). On removal, your data is deleted from their node.
        </li>
      </ul>

      <h3>2. Handle dormancy</h3>
      <p>
        Handles you register are tied to your wallet on the blockchain. If you
        delete your device keys and stop using the app, your handle remains
        registered but becomes dormant — no one can interact with you through
        it because the node it points to is offline.
      </p>
      <p>
        For extra privacy, you can also transfer your handle to another wallet
        (e.g., a throwaway wallet you then discard the keys for) via the
        contract. Interacting with the contract directly requires a block
        explorer or a tool like Etherscan; a built-in &quot;release handle&quot;
        feature is planned for a future app update.
      </p>

      <h3>3. Remove the app from your phone</h3>
      <p>
        Uninstall the Archeum app from your device. This removes all
        locally-stored keys, your mnemonic, and app settings.
      </p>

      <h2>What data is deleted vs. retained</h2>
      <ul>
        <li>
          <strong>Deleted immediately</strong>: All on-device data (wallet
          keys, mnemonic, app settings). Uninstalling the app wipes this.
        </li>
        <li>
          <strong>Deleted by your action</strong>: All data stored on your
          node across every app&apos;s namespace — you control when and how this
          is removed.
        </li>
        <li>
          <strong>Cannot be deleted</strong>: On-chain handle registration
          history. The blockchain is immutable by design — past registrations,
          transfers, and releases remain publicly visible. However, once you
          transfer or release a handle, your wallet address is no longer the
          current owner going forward.
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
