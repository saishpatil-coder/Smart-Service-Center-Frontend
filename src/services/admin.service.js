import api from "@/lib/axios";

/* ---------------------- ADD NEW MECHANIC ---------------------- */
export async function addMechanic(name, email, mobile, password) {
  try {
    const res = await api.post("/admin/add-mechanic", {
      name,
      email,
      mobile,
      password,
      role: "MECHANIC",
    });

    return {
      success: true,
      message: res.data.message || "Mechanic added successfully",
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to add mechanic. Please try again.",
    };
  }
}

/* ----------------------- GET MECHANICS LIST ----------------------- */
export async function getAllMechanics() {
  try {
    const res = await api.get("/admin/mechanics");

    return {
      success: true,
      data: res.data.mechanics || [],
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to fetch mechanics.",
    };
  }
}

/* ---------------------- DISABLE A MECHANIC ----------------------- */
export async function disableMechanic(mechanicId) {
  try {
    const res = await api.put(`/admin/mechanic/${mechanicId}/disable`);

    return {
      success: true,
      message: res.data.message || "Mechanic disabled",
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to disable mechanic.",
    };
  }
}

/* ---------------------- DELETE A MECHANIC ----------------------- */
export async function deleteMechanic(mechanicId) {
  try {
    const res = await api.delete(`/admin/mechanic/${mechanicId}`);

    return {
      success: true,
      message: res.data.message || "Mechanic deleted",
    };
  } catch (error) {
    return {
      success: false,
      message: "Unable to delete mechanic.",
    };
  }
}

export async function getAllServices(){
  try {
    const res = await api.get("/admin/services");
    return {
      success:true,
      data: res.data.services || [],
    }
  } catch (error) {
    return {
      success:false,
      message: "Unable to fetch services.",
    }
  }
}

export async function getPendingTickets(page=1){
  return await api.get(`/admin/pending-tickets?page=${page}`);
}

export async function getAssignementQueue(){
  return await api.get("/admin/assignment-queue");
}

export async function savePriorityOfTicket(ticketId, newPriority){
  await api.post(`/admin/ticket/${ticketId}/priority`, {
        customPriority: newPriority,
      });
}

export async function escalateTicket(id) {
          await api.post(`/admin/ticket/${id}/escalate`);
}