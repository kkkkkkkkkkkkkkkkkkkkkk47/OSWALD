import { HiOutlineInbox } from 'react-icons/hi';

export default function EmptyState({ title = 'No data found', description = '', icon: Icon = HiOutlineInbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-16 h-16 text-dark-300 dark:text-dark-600 mb-4" />
      <h3 className="text-lg font-medium text-dark-700 dark:text-dark-300 mb-1">{title}</h3>
      {description && <p className="text-dark-500 text-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}
