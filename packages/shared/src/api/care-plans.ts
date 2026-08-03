import { api } from "../api-client";
import type {
  CarePlan,
  CarePlanItem,
  CarePlanWithItems,
  CreateCarePlanItemPayload,
  CreateCarePlanPayload,
  MyCarePlanView,
  UpdateCarePlanItemPayload,
  UpdateCarePlanPayload,
} from "../types/care-plans";

export async function listCarePlans(orgId: string, patientId: string) {
  return api<CarePlan[]>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans`,
    { auth: true },
  );
}

export async function getActiveCarePlan(orgId: string, patientId: string) {
  return api<CarePlanWithItems>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans/active`,
    { auth: true },
  );
}

export async function createCarePlan(
  orgId: string,
  patientId: string,
  payload: CreateCarePlanPayload,
) {
  return api<CarePlan>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateCarePlan(
  orgId: string,
  patientId: string,
  planId: string,
  payload: UpdateCarePlanPayload,
) {
  return api<CarePlan>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans/${encodeURIComponent(planId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function createCarePlanItem(
  orgId: string,
  patientId: string,
  planId: string,
  payload: CreateCarePlanItemPayload,
) {
  return api<CarePlanItem>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans/${encodeURIComponent(planId)}/items`,
    {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function updateCarePlanItem(
  orgId: string,
  patientId: string,
  itemId: string,
  payload: UpdateCarePlanItemPayload,
) {
  return api<CarePlanItem>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans/items/${encodeURIComponent(itemId)}`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteCarePlanItem(
  orgId: string,
  patientId: string,
  itemId: string,
) {
  return api<{ message: string }>(
    `/organizations/${encodeURIComponent(orgId)}/patients/${encodeURIComponent(patientId)}/care-plans/items/${encodeURIComponent(itemId)}`,
    { method: "DELETE", auth: true },
  );
}

export async function getMyCarePlan(orgId: string) {
  return api<MyCarePlanView>(
    `/organizations/${encodeURIComponent(orgId)}/care-plans/me`,
    { auth: true },
  );
}
