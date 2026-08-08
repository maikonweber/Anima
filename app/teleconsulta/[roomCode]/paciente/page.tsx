"use client";

import { useParams } from "next/navigation";
import { TeleconsultRoleJoinShell } from "@/components/clinic/TeleconsultRoleJoinShell";

export default function TeleconsultPatientPage() {
  const params = useParams<{ roomCode: string }>();
  return (
    <TeleconsultRoleJoinShell
      roomCodeParam={params.roomCode ?? ""}
      routeRole="paciente"
    />
  );
}
