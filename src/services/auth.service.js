import api from "@/lib/axios";


export async function login(email, password) {
    console.log("logging in")
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data)
  return res.data;
}

export async function register(name, mobile, email, password) {
  const res = await api.post("/auth/register", {
    name,
    mobile,
    email,
    password,
  });
  return res.data;
}

export async function logout() {
  await api.post("/auth/logout");
  return ;
}

export async function getCurrentUser() {
  try{
    const res = await api.get("/auth/me");
  return res.data;
  }catch(err){
    return null;
  }
}


export async function deleteFCMToken() {
  console.log("deleting fcm token from backend")
  const token = localStorage.getItem("fcm_token");
  if (!token) return;

  await api.post("/users/remove-fcm-token", { token });
  
}