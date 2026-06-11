import api from "@/lib/axios";


export async function login(email, password) {
    console.log("logging in")
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data)
    if (res.data && res.data.token) {
      document.cookie = `token=${res.data.token}; path=/; max-age=3600; SameSite=Lax`;
    }
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
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
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
    localStorage.removeItem("fcm_sent"); 
  console.log("deleting fcm token from backend")
  const token = localStorage.getItem("fcm_token");
  if (!token) return;

  await api.post("/users/remove-fcm-token", { token });
  
}