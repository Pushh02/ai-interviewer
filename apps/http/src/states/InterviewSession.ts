interface ResponseSchema {
    questionNumber: number;
    question: string;
    answer: string;
}

interface SessionMetadata {
    createdAt: Date;
    topic: string;
    expertise: string;
    name: string;
    systemPrompt: string;
    responses: ResponseSchema[];
}

export class InterviewSession {
    private static instance: InterviewSession | null = null;
    private sessions: Map<string, SessionMetadata> = new Map();

    private constructor() {}

    public static getInstance(): InterviewSession {
        if (!InterviewSession.instance) {
            InterviewSession.instance = new InterviewSession();
        }
        return InterviewSession.instance;
    }

    public startSession(topic: string, expertise: string, name: string, sessionId: string, systemPrompt: string): string {
        const sessionData: SessionMetadata = {
            createdAt: new Date(),
            topic,
            expertise,
            name,
            systemPrompt,
            responses: []
        };
        
        this.sessions.set(sessionId, sessionData);
        return sessionId;
    }

    public addToCache(sessionId: string, response: ResponseSchema): void {
        const session = this.getSession(sessionId);
        if (!session) throw new Error('Session not found');

        session.responses.push(response);
        this.sessions.set(sessionId, session);
    }

    public getSessionResponses(sessionId: string): {responses: ResponseSchema[], systemPrompt: string} {
        const session = this.getSession(sessionId);
        return {responses: session?.responses || [], systemPrompt: session?.systemPrompt || ""};
    }

    public updateSessionResponses(sessionId: string, response: ResponseSchema[]): void {
        const session = this.getSession(sessionId);
        if (!session) throw new Error('Session not found');

        session.responses = response;
        this.sessions.set(sessionId, session);
    }

    public clearSession(sessionId: string): void {
        this.sessions.delete(sessionId);
    }

    public isSessionActive(sessionId: string): boolean {
        return this.sessions.has(sessionId);
    }

    private getSession(sessionId: string): SessionMetadata | undefined {
        return this.sessions.get(sessionId);
    }

    public getSessionMetadata(sessionId: string): SessionMetadata | undefined {
        return this.getSession(sessionId);
    }

    // Optional: Get all active sessions (useful for debugging or admin purposes)
    public getAllSessions(): Map<string, SessionMetadata> {
        return new Map(this.sessions);
    }
}