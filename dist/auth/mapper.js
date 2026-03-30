export function mapApiUserToUser(apiUser) {
    return {
        id: apiUser.id,
        email: apiUser.email,
        firstName: apiUser.firstName,
        lastName: apiUser.lastName,
        username: apiUser.username,
        communities: apiUser.communities || [],
        communities_member: apiUser.communities_member || [],
    };
}
//# sourceMappingURL=mapper.js.map