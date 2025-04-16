interface Friend {
    user_id: string;
    username: string;
    avatar_url: string | null;
  }
  
interface DirectMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
  }
  