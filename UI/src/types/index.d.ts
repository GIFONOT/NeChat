interface User {
  id: string;
  email: string;
  username: string;
  image: string | null;
}

type Message = {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string | null;
  };
  timestamp: Date;
  type: 'user' | 'system';
};
