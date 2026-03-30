import type { User } from "../collaborative/types";
import type { Community, CommunityMember } from "../collaborative/types";

export interface ApiUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  description?: string;
  communities?: Community[];
  communities_member?: CommunityMember[];
}

export function mapApiUserToUser(apiUser: ApiUserResponse): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    username: apiUser.username,
    avatar: apiUser.avatar,
    description: apiUser.description,
    communities: apiUser.communities || [],
    communities_member: apiUser.communities_member || [],
  };
}
