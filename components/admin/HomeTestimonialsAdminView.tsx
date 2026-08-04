"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { ApiError } from "@/lib/api-client";
import {
  useCreateHomeTestimonial,
  useDeleteHomeTestimonial,
  useHomeTestimonialsAdmin,
  useUpdateHomeTestimonial,
} from "@/hooks/use-home-testimonials";
import type { HomeTestimonialAdmin } from "@anima/shared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { HomeTestimonialInviteGenerator } from "@/components/admin/HomeTestimonialInviteGenerator";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Falha ao ler a imagem."));
    };
    reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(file);
  });
}

type FormState = {
  authorName: string;
  authorRole: string;
  quote: string;
  sortOrder: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  authorName: "",
  authorRole: "",
  quote: "",
  sortOrder: "0",
  isActive: true,
};

export function HomeTestimonialsAdminView() {
  const { data, isLoading, error, refetch } = useHomeTestimonialsAdmin();
  const createMutation = useCreateHomeTestimonial();
  const updateMutation = useUpdateHomeTestimonial();
  const deleteMutation = useDeleteHomeTestimonial();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!editingId) {
      setForm(EMPTY_FORM);
      setPhotoFile(null);
      return;
    }
    const item = data?.find((row) => row.id === editingId);
    if (!item) return;
    setForm({
      authorName: item.authorName,
      authorRole: item.authorRole ?? "",
      quote: item.quote,
      sortOrder: String(item.sortOrder),
      isActive: item.isActive,
    });
    setPhotoFile(null);
  }, [editingId, data]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const sortOrder = Number.parseInt(form.sortOrder, 10);
    if (Number.isNaN(sortOrder) || sortOrder < 0) {
      setFormError("Ordem deve ser um número ≥ 0.");
      return;
    }

    const payload = {
      authorName: form.authorName.trim(),
      authorRole: form.authorRole.trim() || undefined,
      quote: form.quote.trim(),
      sortOrder,
      isActive: form.isActive,
    };

    try {
      let photoBase64: string | undefined;
      if (photoFile) {
        photoBase64 = await fileToDataUrl(photoFile);
      }

      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          payload: { ...payload, ...(photoBase64 ? { photoBase64 } : {}) },
        });
      } else {
        await createMutation.mutateAsync({
          ...payload,
          ...(photoBase64 ? { photoBase64 } : {}),
        });
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      setPhotoFile(null);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar o depoimento.",
      );
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Remover este depoimento?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Falha ao remover depoimento.",
      );
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white/95">
          Depoimentos da home
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/45">
          Gerencie foto + texto exibidos na landing page. Apenas depoimentos
          ativos aparecem publicamente, ordenados pelo campo &quot;Ordem&quot;.
        </p>
      </header>

      <HomeTestimonialInviteGenerator />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
      >
        <h2 className="text-sm font-medium text-white/80">
          {editingId ? "Editar depoimento" : "Novo depoimento"}
        </h2>

        {formError ? (
          <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Nome"
            value={form.authorName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, authorName: e.target.value }))
            }
            required
          />
          <Input
            label="Cargo / contexto"
            value={form.authorRole}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, authorRole: e.target.value }))
            }
            placeholder="Ex.: Psicóloga · Clínica X"
          />
        </div>

        <label className="block text-sm">
          <span className="mb-1.5 block text-foreground/70">Depoimento</span>
          <textarea
            value={form.quote}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, quote: e.target.value }))
            }
            required
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 outline-none focus:border-anima-violet/40"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Ordem (menor = primeiro)"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, sortOrder: e.target.value }))
            }
          />
          <label className="flex items-center gap-2 pt-7 text-sm text-white/70">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-white/20"
            />
            Ativo na home
          </label>
        </div>

        <label className="block text-sm text-white/70">
          <span className="mb-1.5 block">Foto (JPEG, PNG, WebP — max 2 MB)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-anima-violet/20 file:px-3 file:py-2 file:text-xs file:text-anima-violet"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <Button type="submit" isLoading={isSaving}>
            {editingId ? "Salvar alterações" : "Criar depoimento"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingId(null)}
            >
              Cancelar
            </Button>
          ) : null}
        </div>
      </form>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-white/70">Publicados</h2>
        {isLoading ? (
          <p className="text-sm text-white/40">Carregando…</p>
        ) : error ? (
          <ErrorMessage
            message={
              error instanceof ApiError
                ? error.message
                : "Erro ao carregar depoimentos."
            }
            onRetry={() => refetch()}
          />
        ) : !data?.length ? (
          <p className="text-sm text-white/40">Nenhum depoimento cadastrado.</p>
        ) : (
          <ul className="space-y-3">
            {data.map((item) => (
              <TestimonialRow
                key={item.id}
                item={item}
                onEdit={() => setEditingId(item.id)}
                onDelete={() => handleDelete(item.id)}
                deleting={deleteMutation.isPending}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function TestimonialRow({
  item,
  onEdit,
  onDelete,
  deleting,
}: {
  item: HomeTestimonialAdmin;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-3 min-w-0">
        {item.photoUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10">
            <Image
              src={item.photoUrl}
              alt={item.authorName}
              fill
              className="object-cover"
              sizes="48px"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-anima-violet/15 text-xs font-semibold text-anima-violet">
            {item.authorName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-white/90">
            {item.authorName}
            {!item.isActive ? (
              <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-400/80">
                inativo
              </span>
            ) : null}
          </p>
          {item.authorRole ? (
            <p className="text-xs text-white/45">{item.authorRole}</p>
          ) : null}
          <p className="mt-2 text-sm text-white/60 line-clamp-3">
            “{item.quote}”
          </p>
          <p className="mt-2 text-[11px] text-white/30">
            ordem {item.sortOrder}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button type="button" variant="secondary" onClick={onEdit}>
          Editar
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onDelete}
          isLoading={deleting}
        >
          Excluir
        </Button>
      </div>
    </li>
  );
}
