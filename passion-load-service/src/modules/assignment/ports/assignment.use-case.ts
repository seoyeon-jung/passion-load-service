export interface AssignmentUseCase {
  validateAssignment(orgId: string, assignmentId: string): Promise<void>;
}
