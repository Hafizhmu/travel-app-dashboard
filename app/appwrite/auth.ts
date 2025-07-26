import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";
import axios from "axios";

export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(OAuthProvider.Google);
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
export const getGooglePicture = async () => {
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
export const storeUserData = async () => {
  try {
    const user = await account.get();

    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", user.$id)]
    );
    if (documents.length > 0) return documents[0];

    const imageUrl = await getGooglePicture();

    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: imageUrl || "",
        joinedAt: new Date().toISOString(),
      }
    );

    return newUser;
  } catch (error) {
    console.error("Store user data:", error);
  }
};
export const getExistingUser = async () => {
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
