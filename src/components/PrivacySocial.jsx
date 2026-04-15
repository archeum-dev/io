export default function PrivacySocial() {
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
      <h1>Privacy Policy — Social</h1>
      <p><em>Last updated: April 15, 2026</em></p>

      <h2>Overview</h2>
      <p>
        Social is a decentralized social app built on the Archeum
        network. It connects to the node you own (through the Archeum app) to
        read and write your social data. Archeum the publisher does not operate
        servers that receive or store your data.
      </p>

      <h2>Data stored on your device</h2>
      <ul>
        <li>Cached copies of your posts, profile, and other users&apos; content you&apos;ve viewed</li>
        <li>App settings and preferences</li>
        <li>Draft messages and unsent posts</li>
      </ul>
      <p>
        Sensitive credentials (wallet keys, encryption keys) are never handled
        by this app directly. They are held by the Archeum app on the same
        device, which signs operations on request.
      </p>

      <h2>Data sent over the network</h2>
      <ul>
        <li>
          <strong>Your node</strong>: posts, replies, likes, follows, messages,
          and profile updates are written to the node you own. You control what
          is public, what is encrypted, and who you share with.
        </li>
        <li>
          <strong>Other users&apos; nodes</strong>: to read someone else&apos;s posts or
          send them a message, the app connects to that user&apos;s node (over QUIC)
          using their public Archeum handle.
        </li>
        <li>
          <strong>Blockchain reads</strong>: the app queries the Base network to
          resolve Archeum handles to node endpoints.
        </li>
      </ul>

      <h2>What other users can see</h2>
      <p>
        Content you publish publicly (public posts, profile name/bio, public
        likes and follows) is readable by anyone on the Archeum network and is
        stored unencrypted on your node.
      </p>
      <p>
        Content you share with specific recipients (private posts,
        friends-only posts, direct messages) is end-to-end encrypted (AGE) to
        the recipients&apos; public keys. Only they can decrypt it, even if someone
        else obtains the stored ciphertext.
      </p>
      <p>
        Archeum handles are pseudonymous — they are not tied to your real name
        unless you choose to share it.
      </p>

      <h2>Data we (the publisher) receive</h2>
      <p>
        By default, <strong>nothing</strong>. No analytics, no telemetry, no
        crash reporting, no ad tracking.
      </p>
      <p>
        If you tap <em>Settings → Send Feedback</em>, the app opens the system
        share sheet (or email app) with recent debug logs (up to ~50 KB,
        normally kept only in memory; briefly written to a temp file for the
        share sheet attachment, cleaned up by the OS) addressed to{' '}
        <code>contact@archeum.io</code>. Nothing is sent unless you choose to
        send it.
      </p>

      <h2>User-generated content & moderation</h2>
      <p>
        Social does not moderate content centrally. You can block and
        mute other users locally. Content you block is filtered out of your own
        feed — it is not removed from the network. For reporting illegal content,
        contact <a href="mailto:contact@archeum.io" style={{color: '#8ab4ff'}}>contact@archeum.io</a>;
        we will respond in line with applicable laws, but we do not control
        user-operated nodes.
      </p>

      <h2>Permissions</h2>
      <ul>
        <li><strong>Internet</strong>: connect to nodes.</li>
        <li><strong>Camera</strong>: take photos/videos to post.</li>
        <li><strong>Storage</strong>: attach existing media to posts.</li>
        <li><strong>Notifications</strong>: alert you to replies and messages.</li>
      </ul>

      <h2>Third parties</h2>
      <ul>
        <li><strong>Archeum app</strong> — handles all wallet signing and encryption on your behalf (same device only; no network).</li>
        <li><strong>Base (Coinbase)</strong> — public blockchain used to resolve handles.</li>
        <li><strong>Google Play Services</strong> — for app distribution and (in future releases) Play Integrity device attestation.</li>
      </ul>

      <h2>Children</h2>
      <p>Social is not intended for users under 18.</p>

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
