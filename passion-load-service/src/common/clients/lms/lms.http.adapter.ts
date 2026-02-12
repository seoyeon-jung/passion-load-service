import axios, { AxiosInstance } from 'axios';
import { LmsClient } from './lms.client';
import { LmsListResponse, LmsStudent, LmsTeacher } from './lms.types';

export class LmsHttpAdapter implements LmsClient {
  private readonly http: AxiosInstance;

  constructor() {
    const baseURL = process.env.LMS_BASE_URL;
    if (!baseURL) throw new Error('LMS_BASE_URL is not set');

    const apiKey = process.env.LMS_API_KEY;

    this.http = axios.create({
      baseURL,
      timeout: 5000,
      headers: {
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
    });
  }

  async getTeachersByOrganization(orgId: string): Promise<LmsTeacher[]> {
    const { data } = await this.http.get<LmsListResponse<LmsTeacher>>(
      `/organizations/${orgId}/teachers`,
    );
    return data.items ?? [];
  }

  async getStudentsByOrganization(orgId: string): Promise<LmsStudent[]> {
    const { data } = await this.http.get<LmsListResponse<LmsStudent>>(
      `/organizations/${orgId}/students`,
    );
    return data.items ?? [];
  }
}