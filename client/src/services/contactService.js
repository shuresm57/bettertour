import { toast } from 'svelte-sonner';
import { fetchPost } from '../util/fetchUtil.js';

export async function handleContact (name, email, message) {
  if (!name || !email || !message) {
    toast.error('Please fill in all fields.');
    return false;
  }
  const response = await fetchPost('/api/contact', { name, email, message });
  if (response?.ok) {
    toast.success('Message sent!');
    return true;
  }
  toast.error('Failed to send message. Try again later.');
  return false;
}
