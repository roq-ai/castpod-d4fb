const mapping: Record<string, string> = {
  episodes: 'episode',
  individuals: 'individual',
  playlists: 'playlist',
  podcasts: 'podcast',
  snippets: 'snippet',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
