async function fetchT(source: string, timeout: number, options: any){
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


export default async function checkToken(): Promise<boolean> {
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
    else{
      return false;
    }
  } catch (e) {
    return false;
  }
}
