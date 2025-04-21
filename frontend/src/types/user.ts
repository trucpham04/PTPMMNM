// User model type
export interface User {
  id: number;
  username: string;
  email: string;
  // password: string;
  // first_name: string;
  // last_name: string;
  // is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  // date_joined: string; // ISO date string
  // last_login: string | null; // ISO date string

  // Custom fields
  profile_picture?: string; // URL from Cloudinary
  bio?: string;
  date_of_birth?: string; // ISO date string (YYYY-MM-DD)
  country?: string;

  // Related fields
  // groups: Group[];
  // user_permissions: Permission[];

  // // Virtual fields from related models
  // following: UserFollow[];
  // followers: UserFollow[];
}

// Group type (simplified)
export interface Group {
  id: number;
  name: string;
}

// Permission type (simplified)
export interface Permission {
  id: number;
  name: string;
  codename: string;
  content_type_id: number;
}

// UserFollow model type
export interface UserFollow {
  id: number;
  follower_id: number;
  followed_id: number;
  followed_at: string; // ISO date string

  // Optional expanded relations (useful for API responses)
  follower?: User;
  followed?: User;
}
