import {Audio} from 'expo-av';

const getFolderByName = async (accessToken, folderName) => {
  const query = encodeURIComponent(`name='${folderName}'`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
      q: "mimeType='application/vnd.google-apps.folder'",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error listing files:', errorData);
    throw new Error(errorData.message);
  }
  const data = await response.json();
  const folderID = data.files.map(({id}) => id);
  return folderID;
};

export const getFolderSongs = async (accessToken, folderID) => {
  const query = encodeURIComponent(`'${folderID}' in parents`);
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(name,webContentLink)`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error listing files:', errorData);
    throw new Error(errorData.message);
  }
  const data = await response.json();
  const songs = data.files.map(({name, webContentLink}) => {
    return {
      title: name.replace('.mp3', ''),
      url: webContentLink,
      song: new Audio.Sound(),
    };
  });

  return songs;
};

export const getAlbums = async accessToken => {
  const albumsFolderID = await getFolderByName(accessToken, 'Albums');
  const query = encodeURIComponent(
    `'${albumsFolderID}' in parents and mimeType='application/vnd.google-apps.folder'`,
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error listing files:', errorData);
    throw new Error(errorData.message);
  }
  const data = await response.json();
  const albums = data.files;
  return albums;
};

export const getPlaylists = async accessToken => {
  const playlistsFolderID = await getFolderByName(accessToken, 'Playlists');
  const query = encodeURIComponent(
    `'${playlistsFolderID}' in parents and mimeType='application/vnd.google-apps.folder'`,
  );
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
    {
      headers: {Authorization: `Bearer ${accessToken}`},
    },
  );
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error listing files:', errorData);
    throw new Error(errorData.message);
  }
  const data = await response.json();
  const playlists = data.files;
  return playlists;
};
