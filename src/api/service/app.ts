import { HttpService } from '@/api/service/index';
import { BASE_API_URL, BEARER_TOKEN } from '@/app/environment';
import { ScheduleRequest, ScheduleResponse } from '@/api/model/schedule';

export class AppService {
    private service: HttpService;

    constructor(service: HttpService) {
        this.service = service;
    }

    public async fetchSchedule(params: ScheduleRequest): Promise<ScheduleResponse> {
        return this.service.fetchData('/v3/app/linear', { params });
    }
}

const executor = new HttpService(BASE_API_URL, {
    Authorization: `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
});
export const appService = new AppService(executor);
