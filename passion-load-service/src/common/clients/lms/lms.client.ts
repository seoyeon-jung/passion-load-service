import { LmsStudent, LmsTeacher } from "./lms.types";

export interface LmsClient {
    getTeachersByOrganization(orgId: string): Promise<LmsTeacher[]>;
    getStudentsByOrganization(orgId: string): Promise<LmsStudent[]>;
}