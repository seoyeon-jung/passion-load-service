import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { SESSION_REPOSITORY } from "../persistence.tokens";
import type { SessionRepositoryPort } from "./ports/session.repository.port";
import { randomUUID } from "crypto";
import { SessionStatus } from "../../common/types/enums";

@Injectable()
export class SessionService {
    constructor(
        @Inject(SESSION_REPOSITORY)
        private readonly sessions: SessionRepositoryPort,
    ) {}

    async create(orgId: string, input: { title: string; date: string }) {
        return this.sessions.create({
            id: randomUUID(),
            orgId,
            title: input.title,
            date: input.date,
            status: SessionStatus.PLANNED,
        });
    }

    async get(orgId: string, id: string) {
        const session = await this.sessions.findById(id);

        if (!session || session.orgId !== orgId) {
            throw new NotFoundException('session not found');
        }

        return session;
    }

    async list(orgId: string) {
        return this.sessions.listByOrg(orgId);
    }
}