// export interface Message {
//     id: number;
//     content: string;
//     timestamp: string;
//     sender: {
//         id: number;
//         name: string;
//         email: string;
//     };
//     group: {
//         id: number;
//         name?: string;
//     };

import { Attachment } from "./attachment";

//     seenBy?: SeenByUser[];
// }

// interface SeenByUser {
//   userId: number;      // or string, depends on your user ID type
//   userName: string;
//   seenAt: Date;        // or string (ISO timestamp) if you prefer
// }

export interface Message {
  id: number;
  content: string;  // Text message content (can be empty if only file)
  timestamp: string;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  group: {
    id: number;
    name?: string;
  };
  seenBy?: SeenByUser[];

  // New field to support file attachments
  attachments?: Attachment[]
}

interface SeenByUser {
  userId: number;
  userName: string;
  seenAt: Date;
}

