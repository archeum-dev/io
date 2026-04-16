export default function DeleteData() {
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
      <h1>Deleting App Data (Without Closing Your Account)</h1>
      <p><em>Last updated: April 15, 2026</em></p>

      <h2>Overview</h2>
      <p>
        Archeum stores each app&apos;s data in a separate namespace on your node.
        You can clear data for one app at a time (and optionally revoke that
        app&apos;s access to your identity) without affecting your wallet, your
        handle, or any other app.
      </p>

      <h2>How to clear a single app&apos;s data</h2>
      <ol>
        <li>Open the Archeum app</li>
        <li>Tap your <strong>identity card</strong> at the top of the home screen</li>
        <li>Select <strong>Storage</strong></li>
        <li>Switch to the <strong>Apps</strong> tab</li>
        <li>
          Find the app you want to manage and tap either:
          <ul>
            <li>
              <strong>Clear data</strong> — deletes all of that app&apos;s content
              from your node (posts, messages, profile info, cached media, etc.).
              The app itself is still installed and can write fresh data later.
            </li>
            <li>
              <strong>Revoke</strong> — removes the app&apos;s access to your
              identity. The app stops working until you re-grant access.
              Revoking does not delete existing data; pair with &quot;Clear
              data&quot; to fully wipe an app&apos;s footprint.
            </li>
          </ul>
        </li>
      </ol>

      <h2>What this does and doesn&apos;t do</h2>
      <ul>
        <li>
          <strong>Does</strong>: permanently deletes the selected app&apos;s data
          from your node. Once cleared, no copy remains on your node.
        </li>
        <li>
          <strong>Doesn&apos;t</strong>: affect your wallet keys, your handle,
          your node itself, or other apps&apos; data.
        </li>
        <li>
          <strong>Doesn&apos;t</strong>: reach cached copies on other users&apos; devices.
          If another user already viewed your public content through that app,
          their device may retain a local cache. These caches are ephemeral and
          typically cleared by normal app usage, but we can&apos;t force them to
          clear.
        </li>
      </ul>

      <h2>If you want to delete your entire account</h2>
      <p>
        See <a href="/delete-account" style={{color: '#8ab4ff'}}>Deleting Your Archeum Account</a> for
        the full flow (clear all node data, transfer or release your handle,
        uninstall the app).
      </p>

      <h2>Questions?</h2>
      <p>
        Email <a href="mailto:contact@archeum.io" style={{color: '#8ab4ff'}}>contact@archeum.io</a>.
      </p>
    </div>
  )
}
