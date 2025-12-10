import api from "@/lib/axios";

export async function login(email, password) {
  try{
    const res = await api.post("/auth/login", { email, password });
    console.log(res.data)
  return res.data;
  }catch(err){
    return null;
  }
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
}

export async function getCurrentUser() {
  try{
    const res = await api.get("/auth/me");
  return res.data;
  }catch(err){
    return null;
  }
}