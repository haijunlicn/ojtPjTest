import { GroupChat } from "./groupchat";

export interface User {
    id: number;
    name: string;
    email: string;
    createdGroups: GroupChat[];
    joinedGroups: GroupChat[];
}
