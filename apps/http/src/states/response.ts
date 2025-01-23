interface ResponseSchema {
    questionNumber: number;
    question: string;
    answer: string;
}

export class ResponseData {
    private static instance: ResponseData | null = null;
    private static responseCache: Map<string, ResponseSchema[]> = new Map();
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

    public static getInstance(sessionId: string): ResponseData {
        if (!ResponseData.instance || ResponseData.instance.sessionId !== sessionId) {
            ResponseData.instance = new ResponseData(sessionId);
        }
        return ResponseData.instance;
    }

    public addToCache(response: ResponseSchema) {
        const sessionResponses = ResponseData.responseCache.get(this.sessionId) || [];
        sessionResponses.push(response);
        ResponseData.responseCache.set(this.sessionId, sessionResponses);
        this.response = response;
    }

    public getSessionResponses(): ResponseSchema[] {
        return ResponseData.responseCache.get(this.sessionId) || [];
    }

    public clearSession() {
        ResponseData.responseCache.delete(this.sessionId);
    }

    public getCurrentResponse(): ResponseSchema {
        return this.response;
    }

    public static getAllSessions(): Map<string, ResponseSchema[]> {
        return ResponseData.responseCache;
    }

    public getSessionId(): string {
        return this.sessionId;
    }
}