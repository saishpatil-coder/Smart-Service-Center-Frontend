import api from "@/lib/axios";

/* ----------------------- GET ALL SERVICES ----------------------- */
export async function getAllServices() {
  try {
    const res = await api.get("/client/services");
    return {
      success: true,
      data: res.data.services || [],
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to fetch services.",
    };
  }
}

export async function addTicket(payload) {
    const res = await api.post("/client/add-ticket", payload);
    return {
        success:true,
        data: res.data.ticket,
    }
}