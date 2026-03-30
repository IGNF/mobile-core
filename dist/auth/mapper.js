export function mapApiUserToUser(apiUser) {
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
//# sourceMappingURL=mapper.js.map