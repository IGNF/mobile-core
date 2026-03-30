import type { User } from "../collaborative/types";
import type { Community, CommunityMember } from "../collaborative/types";
export interface ApiUserResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    communities?: Community[];
    communities_member?: CommunityMember[];
}
export declare function mapApiUserToUser(apiUser: ApiUserResponse): User;
//# sourceMappingURL=mapper.d.ts.map