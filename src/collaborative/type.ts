/**
 * Define here the types for the collaborative features
 */

/**
 * User information
 */
export interface User {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  communities: Community[];
  communities_member?: CommunityMember[];
}

export interface CommunityMember {
  id: number;
  community_id: number;
  profile?: any;
}

/**
 * Community (group) information
 */
export interface Community {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  layers?: CommunityLayer[];
  isActive?: boolean;
  profile?: any;
}

/**
 * Community layer definition
 */
export interface CommunityLayer {
  id: number;
  title: string;
  visible?: boolean;
  opacity?: number;
}