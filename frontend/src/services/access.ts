import type { Access } from "@/types/access";
import type { Software } from "@/types/software";
import { httpRequest } from "./http";

const API_URL = import.meta.env.VITE_API_URL;

export async function createAccessByRol(
  userId: string,
  roleId: string,
  software: Software[],
  stateID: string
) {
  const softwareFiltered = software.filter((s) =>
    s.roles?.some((r) => r.id === roleId)
  );
  if (softwareFiltered.length === 0) {
    throw new Error("No hay software disponible para este rol");
  }
  const softwaresId: string[] = softwareFiltered.map((s) => s.id || "");

  const newAccessRequestCreated: Access[] = [];
  for (const id of softwaresId) {
    const newAccessRequest: Access = {
      user_id: userId,
      software_id: id,
      state_request_id: stateID,
    };
    const accessRequestCreated = await createAccessRequest(newAccessRequest);
    newAccessRequestCreated.push(accessRequestCreated);
  }
  return newAccessRequestCreated;
}

export async function createAccessRequest(access: Access): Promise<Access> {
  return httpRequest<Access, Access>(`${API_URL}access/`, access, {
    method: "POST",
  });
}

export async function updateStateAccessRequest(
  accessId: string,
  stateId: string
): Promise<Access> {
  return httpRequest<null, Access>(
    `${API_URL}access/${accessId}/${stateId}`,
    null,
    {
      method: "PATCH",
    }
  );
}
