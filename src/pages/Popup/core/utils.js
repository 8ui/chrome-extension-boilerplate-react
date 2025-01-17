import {ISDEV} from "./constants"

const host = ISDEV ? 'http://localhost:8081' : 'https://213.139.208.207'

export const Fetch = async(url, params = {}) => {
  const { method = 'GET', body, headers = {} } = params
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  Object.keys(headers).forEach(key => {
    myHeaders.append(key, headers[key]);
  })
  let data = await window.fetch(`${host}/v2${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: myHeaders,
  });

  return await data.json();
}
