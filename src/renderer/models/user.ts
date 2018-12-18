export interface UserInfo {
    spotify: {
        loggedIn: boolean;
        token: string;
        user: SpotifyApi.CurrentUsersProfileResponse | null
    }
}