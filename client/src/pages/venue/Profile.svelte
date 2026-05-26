<script>
  import { toast } from 'svelte-sonner';
  import { fetchPut, fetchDelete } from '../../util/fetchUtil.js';
  import { handleLogout } from '../../util/authService.js';

  let { entity } = $props();

  let name = $state(entity.venue_name ?? '');
  let address = $state(entity.address ?? '');
  let bio = $state(entity.bio ?? '');
  let contactEmail = $state(entity.contact_email ?? '');

  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');

  async function saveProfile() {
    const res = await fetchPut('/api/venue/profile', { name, address, bio, contact_email: contactEmail });
    if (res?.ok) {
      entity.venue_name = name;
      entity.address = address;
      entity.bio = bio;
      entity.contact_email = contactEmail;
      toast.success('Profile updated.');
    } else {
      toast.error('Failed to update profile.');
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    const res = await fetchPut('/api/profile/password', { currentPassword, newPassword });
    if (res?.ok) {
      currentPassword = '';
      newPassword = '';
      confirmPassword = '';
      toast.success('Password changed.');
    } else {
      const { errorMessage } = await res.json();
      toast.error(errorMessage ?? 'Failed to change password.');
    }
  }

  async function deleteAccount() {
    if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    const res = await fetchDelete('/api/profile');
    if (res?.ok) {
      handleLogout();
    } else {
      toast.error('Failed to delete account.');
    }
  }
</script>

<div class="flex flex-col gap-6 max-w-2xl">

  <div class="card p-6 space-y-4">
    <div>
      <h2 class="text-xl font-bold">Edit Profile</h2>
      <p class="text-sm text-surface-400 mt-1">Update your venue information.</p>
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Venue name</label>
        <input bind:value={name} class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Address</label>
        <input bind:value={address} class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Bio</label>
        <textarea bind:value={bio} rows="3" class="input text-sm px-3 py-2 rounded-lg w-full resize-none"></textarea>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Contact email</label>
        <input bind:value={contactEmail} type="email" class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
    </div>
    <button onclick={saveProfile} class="text-sm font-medium px-4 py-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors">
      Save changes
    </button>
  </div>

  <div class="card p-6 space-y-4">
    <div>
      <h2 class="text-xl font-bold">Change Password</h2>
      <p class="text-sm text-surface-400 mt-1">Choose a new password for your account.</p>
    </div>
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Current password</label>
        <input bind:value={currentPassword} type="password" class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">New password</label>
        <input bind:value={newPassword} type="password" class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-medium text-surface-400">Confirm new password</label>
        <input bind:value={confirmPassword} type="password" class="input text-sm px-3 py-2 rounded-lg w-full" />
      </div>
    </div>
    <button onclick={changePassword} class="text-sm font-medium px-4 py-2 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 transition-colors">
      Change password
    </button>
  </div>

  <div class="card p-6 border border-red-500/20 space-y-4">
    <div>
      <h2 class="text-xl font-bold text-red-400">Delete Account</h2>
      <p class="text-sm text-surface-400 mt-1">Permanently delete your account and all associated data. This cannot be undone.</p>
    </div>
    <button onclick={deleteAccount} class="text-sm font-medium px-4 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 transition-colors">
      Delete account
    </button>
  </div>

</div>
