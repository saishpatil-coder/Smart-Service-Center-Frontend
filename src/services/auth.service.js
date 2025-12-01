import { auth } from "@/firebase/client";
import api from "@/lib/axios";

import { signInWithEmailAndPassword ,createUserWithEmailAndPassword,updateProfile} from "firebase/auth";
import axios from "axios";
export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await result.user.getIdToken();
  await api.post("/auth/login", { idToken });
  return result.user;
}
export async function registerUser(name, mobile, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, {displayName: name,});
  const idToken = await result.user.getIdToken();
  await api.post("/auth/register", {idToken,name,mobile,});
  return result.user;
}
