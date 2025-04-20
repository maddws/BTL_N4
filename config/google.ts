// import { useEffect } from 'react';
// import * as WebBrowser from 'expo-web-browser';
// import * as Google from 'expo-auth-session/providers/google';
// import auth, { FirebaseAuthTypes, GoogleAuthProvider } from '@react-native-firebase/auth';
// import { makeRedirectUri } from 'expo-auth-session';

// WebBrowser.maybeCompleteAuthSession();

// export function useGoogle(onDone: (u: FirebaseAuthTypes.User) => void) {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     //androidClientId:  '550103698081-xxx.apps.googleusercontent.com',
//     webClientId:      '550103698081-nro9evbnt3ueq9ucvqmlodj05kba3egk.apps.googleusercontent.com',
//     redirectUri: makeRedirectUri({ native: 'com.ptit.petcare:/oauth2redirect/google' }),
//   });

//   useEffect(() => {
//     if (response?.type === 'success') {
//       const { idToken, accessToken } = response.authentication!;
//       const credential = GoogleAuthProvider.credential(idToken, accessToken);
//       auth()
//         .signInWithCredential(credential)
//         .then(res => onDone(res.user));
//     }
//   }, [response]);

//   return { promptAsync, ready: !!request };
// }
