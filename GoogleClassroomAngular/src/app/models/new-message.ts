export interface NewMessage {
    content: string;
    timestamp: string;
    sender: {
        email: string;
    };
    groupId: number;
}
