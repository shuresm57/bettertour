export function formatDate (dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB');
}

export function formatDateLong (dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const statusClass = {
  confirmed: 'bg-green-500/15 text-green-400',
  pending: 'bg-yellow-500/15 text-yellow-400'
};
