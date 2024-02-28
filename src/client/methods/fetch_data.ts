import axios, { AxiosRequestConfig } from 'axios';

const useGetData = () => {
	return async (url: string, config: AxiosRequestConfig<any> | undefined) => {
		try {
			const { data } = await axios.get(url, config);
			return { response: data };
		} catch (e) {
			return { error: e };
		}
	}
};

const usePostData = () => {
	return async (url: string, body: any) => {
		try {
			const { data } = await axios.post(url, body);
			return { response: data };
		} catch (e) {
			return { error: e };
		}
	}
};

export { useGetData, usePostData };