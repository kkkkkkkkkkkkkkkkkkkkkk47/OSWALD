export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Platform Settings</h1>
      <div className="glass-card p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Platform Name</label>
                <input className="input-field" defaultValue="Osvald Trading Portfolio Systems" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Support Email</label>
                <input className="input-field" defaultValue="support@osvald.com" readOnly />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">Platform Status</h2>
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 dark:text-green-400 font-medium">All systems operational</span>
            </div>
          </div>
          <p className="text-sm text-dark-400">Settings management will be expanded in future releases. Currently read-only.</p>
        </div>
      </div>
    </div>
  );
}
