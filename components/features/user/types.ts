export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  customStatus?: string;
  theme: {
    primaryColor: string;
    avatarBorder: string;
  };
};