import { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

export class HttpService {
    private api: AxiosInstance;

    constructor(baseURL = '', headers?: Record<string, string>) {
        if (!baseURL) {
            throw new Error('baseURL must be provided');
        }

        this.api = axios.create({
            baseURL,
            headers
        });
    }

    public async fetchData<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config);
        return response.data;
    }

    public async post<T>(url: string, data: object): Promise<T> {
        const response = await this.api.post(url, data);
        return response.data;
    }
}
