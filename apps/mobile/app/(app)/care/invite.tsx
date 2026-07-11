import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  createInvite,
  inviteEmailSchema,
  listSentInvites,
  updateInvite,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CareInviteManageScreen() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const sent = useQuery({
    queryKey: ["sent-invites"],
    queryFn: listSentInvites,
  });

  const create = useMutation({
    mutationFn: async () => {
      const parsed = inviteEmailSchema.safeParse({ viewerEmail: email });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "E-mail inválido");
      }
      return createInvite(parsed.data.viewerEmail);
    },
    onSuccess: () => {
      setEmail("");
      setOk("Convite enviado.");
      setError(null);
      void queryClient.invalidateQueries({ queryKey: ["sent-invites"] });
    },
    onError: (e) => {
      setOk(null);
      if (e instanceof ApiError && e.status === 402) {
        setError(e.planLimit?.message ?? "Limite de convites atingido.");
        return;
      }
      setError(e instanceof Error ? e.message : "Falha ao convidar");
    },
  });

  const patch = useMutation({
    mutationFn: (args: {
      id: string;
      body: { visualizacaoAtiva?: boolean; revogar?: boolean };
    }) => updateInvite(args.id, args.body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sent-invites"] });
    },
  });

  return (
    <Screen
      scroll
      title="Convidar profissional"
      subtitle="Compartilhamento só com o seu consentimento."
    >
      <TextField
        label="E-mail do profissional"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {ok ? <Text style={styles.ok}>{ok}</Text> : null}
      <Button
        title="Enviar convite"
        loading={create.isPending}
        onPress={() => create.mutate()}
      />

      <View style={styles.list}>
        {(sent.data ?? []).map((invite) => (
          <Card key={invite.id}>
            <CardTitle>{invite.viewerEmail}</CardTitle>
            <Muted>
              Status: {invite.status}
              {invite.visualizacaoAtiva ? " · visualização ativa" : ""}
            </Muted>
            {invite.status !== "REVOGADO" ? (
              <View style={styles.row}>
                <Button
                  title={invite.visualizacaoAtiva ? "Pausar" : "Ativar"}
                  variant="secondary"
                  style={styles.half}
                  onPress={() =>
                    patch.mutate({
                      id: invite.id,
                      body: { visualizacaoAtiva: !invite.visualizacaoAtiva },
                    })
                  }
                />
                <Button
                  title="Revogar"
                  variant="danger"
                  style={styles.half}
                  onPress={() =>
                    patch.mutate({ id: invite.id, body: { revogar: true } })
                  }
                />
              </View>
            ) : null}
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, marginTop: spacing.md },
  row: { flexDirection: "row", gap: spacing.sm },
  half: { flex: 1 },
  error: { color: colors.danger, fontSize: 13 },
  ok: { color: colors.success, fontSize: 13 },
});
