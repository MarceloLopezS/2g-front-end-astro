const sendFormData = async (requestURL, { method, body, headers }) => {
  try {
    const result = await fetch(requestURL, { method, body, headers });
    return await result.json();
  } catch (err) {
    return `Fetch error: ${err}`
  }
}

export default sendFormData