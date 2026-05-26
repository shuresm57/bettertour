import { toast } from 'svelte-sonner';
import { fetchPut, fetchDelete } from '../util/fetchUtil.js';
import { handleLogout } from './authService.js';

export async function handleChangePassword (currentPassword, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) {
    toast.error('New passwords do not match.');
    return false;
  }
  const res = await fetchPut('/api/profile/password', { currentPassword, newPassword });
  if (res?.ok) {
    toast.success('Password changed.');
    return true;
  }
  const { errorMessage } = await res.json();
  toast.error(errorMessage ?? 'Failed to change password.');
  return false;
}

export async function handleDeleteAccount () {
  if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
    return;
  }
  const res = await fetchDelete('/api/profile');
  if (res?.ok) {
    handleLogout();
  } else {
    toast.error('Failed to delete account.');
  }
}
