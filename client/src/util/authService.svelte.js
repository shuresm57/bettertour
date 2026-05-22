import { toast } from 'svelte-sonner';
import { fetchPost, fetchGet } from './fetchUtil.js';
import { userStore } from '../stores/userStore.svelte.js';

export async function handleSignup (email, passwordOne, passwordTwo, onSuccess) {
  if (!passwordMatchChecker(passwordOne, passwordTwo)) {
    return;
  }
  if (!emailValidityChecker(email)) {
    return;
  }
  if (!(await checkIfEmailExists(email))) {
    toast.error('Email already in use.');
    return;
  }

  const response = await fetchPost('/api/register', { email, password: passwordOne });
  if (!response?.ok) {
    toast.error('Error signing up. Try again later.');
    return;
  }
  toast.success('User created successfully!');
  onSuccess();
}

export async function handleLogin (email, password) {
  const response = await fetchPost('/api/login', { email, password });
  if (!response) {
    toast.error('Error logging in. Try again later.');
    return;
  }
  const body = await response.json();
  if (response.ok) {
    const homeRes = await fetchGet('/api/home');
    if (homeRes?.ok) {
      const { data, type } = await homeRes.json();
      userStore.user = { ...data, type };
      window.location.href = type === 'artist' ? '/dashboard/artist' : '/dashboard/venue';
    }
    toast.success(body.data);
  } else {
    toast.error(body.errorMessage);
  }
}

export async function handleLogout () {
  const response = await fetchPost('/api/logout', {});
  if (response?.ok) {
    userStore.user = null;
    window.location.href = '/';
  } else {
    toast.error('Logout failed. Try again.');
  }
}

export async function handlePasswordRecovery (email, onSuccess) {
  if (await checkIfEmailExists(email)) {
    toast.error('No user with that email was found.');
    return;
  }
  const response = await fetchPost('/api/request-reset', { email });
  if (!response?.ok) {
    toast.error('An error has occured. Please try again later.');
    return;
  }
  toast.success('Reset link sent.');
  onSuccess();
}

export async function handleResetPassword (token, passwordOne, passwordTwo) {
  if (!passwordMatchChecker(passwordOne, passwordTwo)) {
    return;
  }
  const response = await fetchPost('/api/reset-password', { token, newPassword: passwordOne });
  if (!response) {
    toast.error('An error has occurred. Please try again later.');
    return;
  }
  const body = await response.json();
  if (response.ok) {
    toast.success(body.data);
    setTimeout(() => { window.location.href = '/'; }, 1500);
  } else {
    toast.error(body.errorMessage);
  }
}

function passwordMatchChecker (passwordOne, passwordTwo) {
  if (passwordOne !== passwordTwo) {
    toast.error('Passwords must match.');
    return false;
  }
  return true;
}

function emailValidityChecker (email) {
  if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
    toast.error('Email is invalid.');
    return false;
  }
  return true;
}

async function checkIfEmailExists (email) {
  const response = await fetchGet(`/api/emails/${email}`);
  if (response?.status === 200) {
    return false;
  }
  return true;
}
