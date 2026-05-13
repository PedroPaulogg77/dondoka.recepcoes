"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "../Drawer";
import type { ConfigGlobal } from "@/types/orcamento";

type Props = {
  open: boolean;
  onClose: () => void;
  config: ConfigGlobal;
  onUndo?: () => void;
};

export function DrawerContato({ open, onClose, config, onUndo }: Props) {
  const router = useRouter();
  const [telefone, setTelefone] = useState(config.contato_telefone ?? "");
  const [whatsapp, setWhatsapp] = useState(config.contato_whatsapp ?? "");
  const [instagram, setInstagram] = useState(config.contato_instagram ?? "");
  const [email, setEmail] = useState(config.contato_email ?? "");
  const [endereco, setEndereco] = useState(config.contato_endereco ?? "");
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function salvar() {
    setSalvando(true);
    const res = await fetch("/api/admin/config", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contato_telefone: telefone || null,
        contato_whatsapp: whatsapp || null,
        contato_instagram: instagram || null,
        contato_email: email || null,
        contato_endereco: endereco || null,
      }),
    });
    setSalvando(false);
    if (res.ok) {
      setToast("Contatos salvos!");
      setTimeout(() => setToast(null), 2500);
      router.refresh();
    } else {
      setToast("Erro ao salvar contatos.");
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Contato"
      subtitle="Dados exibidos na seção de contato da proposta"
      onUndo={onUndo}
    >
      <div className="space-y-5">
        {/* Warning banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          <span className="mr-1">&#9888;&#65039;</span>
          Estes contatos são globais — alterações aqui afetam todos os orçamentos.
        </div>

        <label className="block">
          <span className="eyebrow text-bronze">Telefone</span>
          <input
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="(31) 1234-5678"
            className="form-input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="eyebrow text-bronze">WhatsApp</span>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5531972519129"
            className="form-input mt-1.5"
          />
          <span className="text-[11px] text-carvao/50 mt-1 block">
            Só dígitos com DDI, ex: 5531972519129
          </span>
        </label>

        <label className="block">
          <span className="eyebrow text-bronze">Instagram</span>
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="dondokarecepcoes"
            className="form-input mt-1.5"
          />
          <span className="text-[11px] text-carvao/50 mt-1 block">
            Sem @
          </span>
        </label>

        <label className="block">
          <span className="eyebrow text-bronze">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contato@dondoka.com.br"
            className="form-input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="eyebrow text-bronze">Endereço</span>
          <textarea
            rows={2}
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Rua Exemplo, 123 — Bairro, Cidade/MG"
            className="form-input mt-1.5"
          />
        </label>

        <button
          type="button"
          onClick={salvar}
          disabled={salvando}
          className="w-full inline-flex items-center justify-center h-11 rounded-full bg-oliva text-white font-medium text-sm hover:bg-oliva/90 transition disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar contatos"}
        </button>

        {toast && (
          <div className="text-center text-sm text-oliva font-medium animate-in fade-in">
            {toast}
          </div>
        )}
      </div>
    </Drawer>
  );
}
