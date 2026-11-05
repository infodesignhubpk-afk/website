export function WeakPasscodeBanner() {
  return (
    <div role="alert" className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm">
      <p className="font-semibold text-amber-900">Your admin passcode is too short to be safe.</p>
      <p className="mt-1 text-amber-900">
        Set a new, longer one (at least 16 characters; a few random words works well) that is not based on the
        current passcode, in Vercel &gt; Project &gt;
        Settings &gt; Environment Variables &gt; <code>ADMIN_PASSCODE</code>, then redeploy. This signs everyone out,
        including you, so sign back in with the new passcode afterwards.
      </p>
    </div>
  );
}
