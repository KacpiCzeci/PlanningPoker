async function fetchT(source, timeout, options){
    const controller = new AbortController();

    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(source, {
        ...options,
        timeout,
        signal: controller.signal  
    })
    clearTimeout(id);

    return response;
}


export default async function checkToken() {
  const url = 'http://localhost:3333/api/auth/profile';
  const options = {
    mode: 'cors',
    headers: {
        'jwt': sessionStorage.getItem("token")//token
    }
  };
  const timeout = 2000;

  try {
    const response = await fetchT(url, timeout, options);
    if (response.ok) {
      return true; 
    }
  } catch (e) {
    return false;
  }
}
