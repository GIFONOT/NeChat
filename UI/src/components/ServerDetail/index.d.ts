interface Server {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_public: boolean;
  owner_id: string;
  created_at: string;
  user_role: "owner" | "admin" | "member";
}
interface ServerMember {
  id: string;
  user_id: string;
  server_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}
interface TextChannel {
  id: string;
  server_id: string;
  name: string;
  description: string | null;
  position: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}