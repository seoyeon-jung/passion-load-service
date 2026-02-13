import { SessionStatus } from '@prisma/client';

export type Session = {
  id: string;
  orgId: string;

  title: string;
  date: string; // yyyy-mm-dd

  status: SessionStatus;

  createdAt: Date;
  updatedAt: Date;
};
