import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function AuditLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.get('/admin/audit-logs?limit=100').then(r => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Audit Logs</h1>
      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-12 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Resource</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">IP</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(log => (
                  <tr key={log._id} className="border-t border-dark-100 dark:border-dark-700 text-sm">
                    <td className="px-6 py-3 text-dark-900 dark:text-white">{log.user?.name || 'System'}</td>
                    <td className="px-6 py-3"><span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-mono">{log.action}</span></td>
                    <td className="px-6 py-3 text-dark-500">{log.resource}</td>
                    <td className="px-6 py-3 text-dark-500 max-w-xs truncate">{log.details}</td>
                    <td className="px-6 py-3 text-dark-400 font-mono text-xs">{log.ipAddress}</td>
                    <td className="px-6 py-3 text-dark-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
