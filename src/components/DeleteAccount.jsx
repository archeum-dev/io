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
        Archeum is decentralized. <strong>The app publisher does not operate any servers that store your data.</strong>
        There is no central database of user accounts for us to delete from.
      </p>
      <p>
        Your Archeum identity consists of three parts, each of which you fully control:
      </p>
      <ol>
        <li>
          <strong>Your wallet keys</strong> — stored in encrypted on-device storage on your phone.
        </li>
        <li>
          <strong>Your handle</strong> (e.g. <code>@alice</code>) — registered on a public blockchain (Base).
        </li>
        <li>
          <strong>Your data</strong> (profile, posts, messages) — stored on your personal Archeum node, which you own.
        </li>
      </ol>

      <h2>How to delete your account</h2>
      <p>
        Because no developer-side record exists, deletion is something you perform yourself. To fully remove your Archeum account:
      </p>

      <h3>1. Handle dormancy (automatic)</h3>
      <p>
        Handles you register are tied to your wallet on the blockchain. If you delete your device keys and stop using the app, your handle remains registered but becomes dormant — no one can interact with you through it because the node it points to is offline.
      </p>
      <p>
        For extra privacy, you can also transfer your handle to another wallet (e.g., a throwaway wallet you then discard the keys for) via the contract. Interacting with the contract directly requires a block explorer or a tool like Etherscan; a built-in &quot;release handle&quot; feature is planned for a future app update.
      </p>

      <h3>2. Delete your node data</h3>
      <p>
        Your node holds your profile, posts, and messages. Since you own the node, you decide what happens to its data.
      </p>
      <ul>
        <li>
          If you run your node on a phone or computer: delete the Archeum Node application or its data directory.
        </li>
        <li>
          If another user hosts your node (tenant model): ask them to remove you via their Archeum app (Settings → Node Sharing → Remove Tenant).
        </li>
      </ul>

      <h3>3. Remove the app from your phone</h3>
      <p>
        Uninstall the Archeum app (and Archeum Social, if installed) from your device. This removes all locally-stored keys and cached data.
      </p>

      <h2>What data is deleted vs. retained</h2>
      <ul>
        <li>
          <strong>Deleted immediately</strong>: All on-device data (wallet keys, cached content, app settings). Uninstalling the app wipes this.
        </li>
        <li>
          <strong>Deleted by your action</strong>: Profile, posts, messages, and other content on your node — you control when these are removed.
        </li>
        <li>
          <strong>Cannot be deleted</strong>: On-chain handle registration history. The blockchain is immutable by design — past registrations, transfers, and releases remain publicly visible. However, once you release a handle, the handle itself becomes available again and your wallet address is no longer associated with it going forward.
        </li>
        <li>
          <strong>Other users&apos; cached copies</strong>: If other users have already viewed your public content, their apps may have cached it locally. You cannot force those caches to clear.
        </li>
      </ul>

      <h2>What the publisher retains</h2>
      <p>
        <strong>Nothing.</strong> The app publisher operates no servers that receive or store your data. We cannot delete or retain anything on your behalf because we never had it.
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
