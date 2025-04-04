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
