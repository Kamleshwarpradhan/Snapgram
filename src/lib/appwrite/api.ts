import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";


export async function createUserAccount(user: INewUser) {
    try {
      const newAccount = await account.create(
        ID.unique(),
        user.email,
        user.password,
        user.name
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(user.name);
  
      const newUser = await saveUserToDB({
        accountid: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: user.username,
        imageUrl: avatarUrl,
      });
  
      return newUser;
    } catch (error) {
      console.log(error);
      return error;
    }
  }


export async function saveUserToDB(user:{
     accountid: string;
     name:string;
     email:string;
     imageUrl: URL;
     username?:string;
}){
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databasesId,
            appwriteConfig.userscollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
        
    }
}


export async function signInAccount(user:{email:string; password:string}){
     try {    
        // const alreadyExistsession = await account.get();
        // if(alreadyExistsession){
        //   console.log("User is already logged in logging out...");
        //   await account.deleteSession('current');
        // }
        const session = await account.createEmailSession(user.email,user.password);
        return session;
     } catch (error) {
        console.log(error);
        
     }
}


export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
             appwriteConfig.databasesId,
             appwriteConfig.userscollectionId,
             [Query.equal('accountid',currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        
    }
}

export async function signOutAccount(){
   try {
     
       const session = await account.deleteSession("current");

       return session;

   } catch (error) {
       console.log(error);
   }
}

export async function createPost(post: INewPost){
    try {
        // upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) return Error;

        // Get the File Url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl){
            // Might happen that something is corrupted so better to delete the file to save space at database
            deleteFile(uploadedFile.$id); 
            throw Error;
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g,'').split(",") || []

        // save Post to database
        const newPost = await databases.createDocument(
             appwriteConfig.databasesId,
             appwriteConfig.postscollectionId,
             ID.unique(),
             {
                creator: post.userId,
                caption: post.caption,
                imageURL: fileUrl,
                imageid: uploadedFile.$id,
                location: post.location,
                tags: tags
             }
        )
        if(!newPost) {
           await deleteFile(uploadedFile.$id);
           throw Error;
        }
        return newPost;
    } catch (error) {
       console.log(error);
    }
}
export async function updatePost(post: IUpdatePost){
 
    const hasFileToUpdate = post.file.length>0;
    try {
        let image = {
             imageURL: post.imageURL,
             imageid: post.imageid
        }
        if(hasFileToUpdate){
            // upload image to storage
            const uploadedFile = await uploadFile(post.file[0]);
    
            if(!uploadedFile) return Error;
    
            // Get the File Url
            const fileUrl = getFilePreview(uploadedFile.$id);
    
            if(!fileUrl){
                // Might happen that something is corrupted so better to delete the file to save space at database
                deleteFile(uploadedFile.$id); 
                throw Error;
            }

            image = {...image,imageURL: fileUrl,imageid: uploadedFile.$id}
        }

        // Convert tags into array
        const tags = post.tags?.replace(/ /g,'').split(",") || []

        // save Post to database
        const updatedPost = await databases.updateDocument(
             appwriteConfig.databasesId,
             appwriteConfig.postscollectionId,
             post.postId,
             {
                caption: post.caption,
                imageURL: image.imageURL,
                imageid: image.imageid,
                location: post.location,
                tags: tags
             }
        )
        if(!updatedPost) {
           await deleteFile(post.imageid);
           throw Error;
        }
        return updatedPost;
    } catch (error) {
       console.log(error);
    }
}
export async function deletePost(postId:string,imageid: string){
     if(!postId || !imageid) throw Error;

     try {
          await databases.deleteDocument(
             appwriteConfig.databasesId,
             appwriteConfig.postscollectionId,
             postId
          )

          return {status: 'Ok'}
     } catch (error) {
        console.log(error);
        
     }
}
export async function uploadFile(file: File){
    try {
       // To upload File in the storage we use createFile
      const uploadedFile = await storage.createFile(
         appwriteConfig.storageId,
         ID.unique(),
         file
      )

      return uploadedFile;
    } catch (error) {
       console.log(error);
       
    }
}

export  function getFilePreview(fileId: string){
    try {
          const fileUrl = storage.getFilePreview(
              appwriteConfig.storageId,
              fileId,
              2000,
              2000,
              "top",
              100
          )

          return fileUrl;
    } catch (error) {
        console.log(error);
    }
}


export async function deleteFile(fileId: string){
    try {

      await storage.deleteFile(appwriteConfig.storageId,fileId);

      return {status: "Ok"}
    } catch (error) {
      console.log(error);
    }
}


export async function getRecentPosts(){
     const posts = await databases.listDocuments(
        appwriteConfig.databasesId,
        appwriteConfig.postscollectionId,
        [Query.orderDesc('$createdAt'),Query.limit(20)]
     )
     if(!posts) throw Error;
     return posts;
}

export async function likePost(postId: string, likesArray:string[]){
     try {
            const updatedPost = await databases.updateDocument(
                 appwriteConfig.databasesId,
                 appwriteConfig.postscollectionId,
                 postId,
                 {
                    likes: likesArray
                 }
            )

            if(!updatedPost) throw Error

            return updatedPost;
     } catch (error) {
        console.log(error);
     }
}

export async function savePost(postId: string,userId: string){
     try {
          const updatedPost = await databases.createDocument(
             appwriteConfig.databasesId,
             appwriteConfig.savescollectionId,
             ID.unique(),
             {
                user: userId,
                post: postId,
             }
          )
          if(!updatedPost) throw Error;

          return updatedPost;
     } catch (error) {
        console.log(error);
        
     }
}
export async function deleteSavedPost(savedRecordId: string){
     try {
          const statusCode = await databases.deleteDocument(
                appwriteConfig.databasesId,
                appwriteConfig.savescollectionId,
                savedRecordId
          );

          if(!statusCode) throw Error;

          return {status: "ok"}
     } catch (error) {
        console.log(error);
        
     }
}

export async function getPostById(postId:string){
     try {
        
       const post = await databases.getDocument(
           appwriteConfig.databasesId,
           appwriteConfig.postscollectionId,
           postId
       )
       if(!post) throw Error;

       return post;
     } catch (error) {
        console.log(error);
        
     }
}

export async function getInfinitePost({pageParam}:{pageParam: number}){
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam.toString()));
    }
  
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databasesId,
        appwriteConfig.postscollectionId,
        queries
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
}

export async function searchPost(searchTerm:string){
    try {
          const posts = await databases.listDocuments(
            appwriteConfig.databasesId,
            appwriteConfig.postscollectionId,
            [Query.search("caption",searchTerm)]
          )
          if(!posts) throw Error;

          return posts;
    } catch (error) {
        console.log(error);
        
    }
}

export async function getAllusers(limit:number){
    const queries: any[] = [Query.orderDesc("$createdAt")];

    if (limit) {
      queries.push(Query.cursorAfter(limit.toString()));
    }
  
    try {
      const users = await databases.listDocuments(
        appwriteConfig.databasesId,
        appwriteConfig.userscollectionId,
        queries
      );
  
      if (!users) throw Error;
  
      return users;
    } catch (error) {
      console.log(error);
    }
}

export async function getUserById(userId: string){
    try {

        const user = await databases.getDocument(
           appwriteConfig.databasesId,
           appwriteConfig.userscollectionId,
           userId
        )

        if(!user) throw Error;

        return user;
    } catch (error) {
      console.log(error);
    }
}

export async function updateUser(user:IUpdateUser){
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databasesId,
      appwriteConfig.userscollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}