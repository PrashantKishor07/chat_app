
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyDeLyKyh44n4Z6yBsh5ELzLKeWcb7xA4bY",
  authDomain: "chat-app-gs-565af.firebaseapp.com",
  projectId: "chat-app-gs-565af",
  storageBucket: "chat-app-gs-565af.appspot.com",
  messagingSenderId: "543962272212",
  appId: "1:543962272212:web:567a91db74a5ad5ec30641",
  measurementId: "G-NC09V4KKSJ"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app)
const db=getFirestore(app)

const signup= async(username,email,password)=>{
  try {
    const res=await createUserWithEmailAndPassword(auth,email,password);
    const user=res.user;
    await setDoc(doc(db,"users",user.uid),

    {
      id:user.uid,
      username:username.toLowerCase(),
      email,
      name:"",
      avatar:"",
      bio:"Hey there, I am using chat app",
      lastSeen:Date.now()
    });
    await setDoc(doc(db,"chats",user.uid),{
      chatsData:[]
    });
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const login=async(email,password)=>{
    try {
      await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
      console.error(error);
      toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout =async()=>{
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
 
}

const resetPass = async (email)=>{
  if (!email) {
    toast.error("Enter your email")
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q=query(userRef,where("email","==",email));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset Email Sent")
    }
    else{
      toast.error("Email doesn't exist")
    }

  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

export {signup,login,logout,auth,db,resetPass};


