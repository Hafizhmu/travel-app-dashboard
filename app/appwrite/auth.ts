import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";
import axios from "axios";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`,
      `${window.location.origin}/404`
    );
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};
export const getUser = async () => {
  try {
    const user = await account.get();

    if (!user) redirect("/sign-in");

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.equal("accountId", user.$id),
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]),
      ]
    );
    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};
export const getGooglePicture = async (accessToken: string) => {
  try {
    const session = await account.getSession("current");
    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      console.log("No oAuthToken Available");
      return null;
    }

    const response = await axios.get(
      "https://people.googleapis.com/v1/people/me",
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
        params: {
          personFields: "photos",
        },
        timeout: 5000, // opsional
      }
    );

    // Asumsikan path ke foto profil ada di response.data.photos[0].url
    const photoUrl = response.data?.photos?.[0]?.url || null;
    return photoUrl;
  } catch (error) {
    console.error("Error fetching Google picture:", error);
    return null;
  }
};
// export const storeUserData = async () => {
//   try {
//     const user = await account.get();

//     if (!user) return null;

//     const { documents } = await database.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       [Query.equal("accountId", user.$id)]
//     );
//     if (documents.length > 0) return documents[0];

//     const imageUrl = await getGooglePicture();

//     const newUser = await database.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.userCollectionId,
//       ID.unique(),
//       {
//         accountId: user.$id,
//         email: user.email,
//         name: user.name,
//         imageUrl: imageUrl || "",
//         joinedAt: new Date().toISOString(),
//       }
//     );

//     return newUser;
//   } catch (error) {
//     console.error("Store user data:", error);
//   }
// };
export const getExistingUser = async (id: string) => {
  try {
    const user = await account.get();

    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", user.$id)]
    );
    if (documents.length === 0) return null;

    return documents[0];
  } catch (error) {
    console.error("Error logging in with Google:", error);
  }
};

export const storeUserData = async () => {
  try {
    const user = await account.get();
    if (!user) throw new Error("User not found");

    const { providerAccessToken } = (await account.getSession("current")) || {};
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    const createdUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(),
      }
    );

    if (!createdUser.$id) redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

export const getAllUsers = async (limit: number, offset: number) => {
  try {
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.limit(limit), Query.offset(offset)]
    );

    if (total === 0) return { users: [], total };

    return { users, total };
  } catch (error) {
    console.log("Error fetching user:", error);
    return { users: [], total: 0 };
  }
};
