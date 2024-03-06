import axios, { AxiosRequestConfig } from "axios";

async function getData(
  url: string,
  config: AxiosRequestConfig<any> | undefined
) {
  const { data } = await axios.get(url, config);
  return data;
}

async function postData(url: string, { arg }: { arg: any }) {
  const { data } = await axios.post(url, { ...arg });
  return data;
}

export { getData, postData };
