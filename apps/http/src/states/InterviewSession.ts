interface ResponseSchema {
    questionNumber: number;
    question: string;
    answer: string;
}

export class InterviewSession {
    private static instance: InterviewSession | null = null;
    private sessionStarted: boolean = false;
    private sessionEnded: boolean = false;
    private topic: string = '';
    private expertise: string = '';
    private sessionData: Map<string, ResponseSchema[]> = new Map();
    private response: ResponseSchema;
    private sessionId: string;

    private constructor(sessionId: string) {
        this.sessionId = sessionId;
        this.response = {
            questionNumber: 0,
            question: "",
            answer: ""
        };
    }

    public static getInstance(sessionId: string): InterviewSession {
        if (!InterviewSession.instance || InterviewSession.instance.sessionId !== sessionId) {
            InterviewSession.instance = new InterviewSession(sessionId);
        }
        return InterviewSession.instance;
    }

    public startSession(topic: string, expertise: string, name: string, sessionId: string) {
        this.topic = topic;
        this.expertise = expertise;
        this.sessionStarted = true;
        this.sessionId = sessionId;
        this.sessionData.set(sessionId, []);
        return this.sessionId;
    }

    public addToCache(response: ResponseSchema) {
        const sessionResponses = this.sessionData.get(this.sessionId) || [];
        sessionResponses.push(response);
        this.sessionData.set(this.sessionId, sessionResponses);
        this.response = response;
    }

    public getSessionResponses(): ResponseSchema[] {
        return this.sessionData.get(this.sessionId) || [];
    }

    public clearSession() {
        this.sessionData.delete(this.sessionId);
    }

    public getCurrentResponse(): ResponseSchema {
        return this.response;
    }

    public getSessionId(): string {
        return this.sessionId;
    }
}