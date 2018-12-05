declare module "vuex-electron" {
  const createPersistedState: any;
  const createSharedMutations: any;
}

declare module "spotify-web-api-node" {
  export interface ApiResponse<T> {
    body: T;
  }

  export class Api {
    setAccessToken(accessToken: string): void;
    getTrack(trackId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    getTracks(trackIds: string[], options?: any, callback?: any): Promise<ApiResponse<any>>;
    getAlbum(albumId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    getAlbums(albumIds: string[], options?: any, callback?: any): Promise<ApiResponse<any>>;
    getArtist(artistId: string, callback?: any): Promise<ApiResponse<any>>;
    getArtists(artistIds: string[], callback?: any): Promise<ApiResponse<any>>;
    search(query: string, types: string[], options?: any, callback?: any): Promise<ApiResponse<any>>;
    searchAlbums(query: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    searchArtists(query: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    searchTracks(query: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    searchPlaylists(query: string, options: any, callback?: any): Promise<ApiResponse<any>>;
    getArtistAlbums(artistId: string, callback?: any): Promise<ApiResponse<any>>;
    getAlbumTracks(albumId: string, callback?: any): Promise<ApiResponse<any>>;
    getArtistTopTracks(artistId: string, country: string, callback?: any): Promise<ApiResponse<any>>;
    getArtistRelatedArtists(artistId: string, callback?: any): Promise<ApiResponse<any>>;
    getUser(userId: string, callback?: any): Promise<ApiResponse<any>>;
    getMe(callback?: any): Promise<ApiResponse<SpotifyApi.CurrentUsersProfileResponse>>;
    getUserPlaylists(
      userId: string,
      options?: any,
      callback?: any
    ): Promise<ApiResponse<SpotifyApi.ListOfUsersPlaylistsResponse>>;
    getPlaylist(userId: string, playlistId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    getPlaylistTracks(
      playlistId: string,
      options?: any,
      callback?: any
    ): Promise<ApiResponse<SpotifyApi.PlaylistTrackResponse>>;
    createPlaylist(
      userId: string,
      playlistName: string,
      options?: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    followPlaylist(userId: string, playlistId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    unfollowPlaylist(
      userId: string,
      playlistId: string,
      options?: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    changePlaylistDetails(
      userId: string,
      playlistId: string,
      options?: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    addTracksToPlaylist(
      userId: string,
      playlistId: string,
      tracks: string[],
      options?: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    removeTracksFromPlaylist(
      userId: string,
      playlistId: string,
      tracks: Object[],
      options: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    removeTracksFromPlaylistByPosition(
      userId: string,
      playlistId: string,
      positions: number[],
      snapshot_id: string,
      callback?: any
    ): Promise<ApiResponse<any>>;
    replaceTracksInPlaylist(
      userId: string,
      playlistId: string,
      uris: Object[],
      callback?: any
    ): Promise<ApiResponse<any>>;
    reorderTracksInPlaylist(
      userId: string,
      playlistId: string,
      rangeStart: number,
      insertBefore: number,
      options: any,
      callback?: any
    ): Promise<ApiResponse<any>>;
    getAudioFeaturesForTrack(trackId: string, callback?: any): Promise<ApiResponse<any>>;
    getAudioFeaturesForTracks(trackIds: string[], callback?: any): Promise<ApiResponse<any>>;
    getRecommendations(options?: any, callback?: any): Promise<ApiResponse<any>>;
    getAvailableGenreSeeds(callback?: any): Promise<ApiResponse<any>>;
    clientCredentialsGrant(options: any, callback?: any): Promise<ApiResponse<any>>;
    authorizationCodeGrant(code: string, callback?: any): Promise<ApiResponse<any>>;
    refreshAccessToken(callback?: any): Promise<ApiResponse<any>>;
    createAuthorizeURL(scopes: string[], state: string): Promise<ApiResponse<any>>;
    getMySavedTracks(options?: any, callback?: any): Promise<ApiResponse<any>>;
    containsMySavedTracks(trackIds: string[], callback?: any): Promise<ApiResponse<any>>;
    removeFromMySavedTracks(trackIds: string[], callback?: any): Promise<ApiResponse<any>>;
    addToMySavedTracks(trackIds: string[], callback?: any): Promise<ApiResponse<any>>;
    removeFromMySavedAlbums(albumIds: string[], callback?: any): Promise<ApiResponse<any>>;
    addToMySavedAlbums(albumIds: string[], callback?: any): Promise<ApiResponse<any>>;
    getMySavedAlbums(options?: any, callback?: any): Promise<ApiResponse<any>>;
    containsMySavedAlbums(albumIds: string[], callback?: any): Promise<ApiResponse<any>>;
    getMyTopArtists(options?: any, callback?: any): Promise<ApiResponse<any>>;
    getMyTopTracks(options?: any, callback?: any): Promise<ApiResponse<any>>;
    followUsers(userIds: string[], callback?: any): Promise<ApiResponse<any>>;
    followArtists(artistIds: string[], callback?: any): Promise<ApiResponse<any>>;
    unfollowUsers(userIds: string[], callback?: any): Promise<ApiResponse<any>>;
    unfollowArtists(artistIds: string[], callback?: any): Promise<ApiResponse<any>>;
    isFollowingUsers(userIds: string[], callback?: any): Promise<ApiResponse<any>>;
    getFollowedArtists(options?: any, callback?: any): Promise<ApiResponse<any>>;
    areFollowingPlaylist(
      userId: string,
      playlistId: string,
      User: String[],
      callback?: any
    ): Promise<ApiResponse<any>>;
    isFollowingArtists(artistIds: string[], callback?: any): Promise<ApiResponse<any>>;
    getNewReleases(options?: any, callback?: any): Promise<ApiResponse<any>>;
    getFeaturedPlaylists(options?: any, callback?: any): Promise<ApiResponse<any>>;
    getCategories(options?: any, callback?: any): Promise<ApiResponse<any>>;
    getCategory(categoryId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    getPlaylistsForCategory(categoryId: string, options?: any, callback?: any): Promise<ApiResponse<any>>;
    play(options?: { context_uri?: string, uris?: string[], offset?: { position?: number }, position_ms?: number }): Promise<ApiResponse<any>>;
    pause(): Promise<ApiResponse<any>>;
  }

  export default Api;
}
