export async function fetchGet (endpoint) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPost (endpoint, body) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPut (endpoint, body) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchDelete (endpoint) {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}
