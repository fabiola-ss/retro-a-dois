/* Formulário que o cliente preenche depois de pagar. Monta a Retrô sozinho. */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ImagePlus,
  Mic,
  Square,
  Trash2,
  X,
} from "lucide-react";

import type { Plano } from "../exemplo/dados";
import { TEMAS } from "../exemplo/temas";
import { enviarPedido, modoTeste, novoSlug, subirArquivo } from "./backend";
import {
  ANO,
  formVazio,
  MESES_NOME,
  montarRetro,
  type Form,
  type Fotos,
} from "./montar";

const PLANOS: Record<Plano, { nome: string; fotos: number }> = {
  basica: { nome: "Básica", fotos: 5 },
  completa: { nome: "Completa", fotos: 30 },
  inesquecivel: { nome: "Inesquecível", fotos: 40 },
};

type Espaco =
  | "favorita"
  | "lugar"
  | "mes"
  | "caos"
  | "antes"
  | "depois"
  | "mural"
  | `comeco${number}`
  | `mesames${number}`;
type Arquivos = Partial<Record<Espaco, File[]>>;

const RASCUNHO = "retro-a-dois:rascunho";

/* ----------------------------- utilitários ----------------------------- */

async function comprimir(arquivo: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(arquivo);
    const max = 1600;
    const esc = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * esc);
    c.height = Math.round(bmp.height * esc);
    c.getContext("2d")?.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((ok) =>
      c.toBlob(ok, "image/jpeg", 0.85),
    );
    return blob ?? arquivo;
  } catch {
    return arquivo;
  }
}

function lerPlano(): Plano {
  const p = new URLSearchParams(location.search).get("plano") ?? "";
  return (["basica", "completa", "inesquecivel"] as Plano[]).includes(
    p as Plano,
  )
    ? (p as Plano)
    : "completa";
}

/* --------------------------- peças do formulário --------------------------- */

function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: ReactNode;
}) {
  return (
    <label className="mf-campo">
      <span className="mf-rotulo">{rotulo}</span>
      {children}
      {dica && <small className="mf-dica">{dica}</small>}
    </label>
  );
}

function Bloco({
  titulo,
  plano,
  children,
}: {
  titulo: string;
  plano?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mf-bloco">
      <legend>
        {titulo}
        {plano && <span className="mf-tag">{plano}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function FotoEspaco({
  rotulo,
  dica,
  max,
  arquivos,
  onMudar,
  restante,
}: {
  rotulo: string;
  dica?: string;
  max: number;
  arquivos: File[];
  onMudar: (f: File[]) => void;
  restante: number;
}) {
  const urls = useMemo(
    () => arquivos.map((a) => URL.createObjectURL(a)),
    [arquivos],
  );
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);
  const cabe = Math.min(max - arquivos.length, restante);
  return (
    <div className="mf-fotos">
      <span className="mf-rotulo">
        {rotulo} <small>{max > 1 ? `até ${max}` : "1 foto"}</small>
      </span>
      {dica && <small className="mf-dica">{dica}</small>}
      <div className="mf-fotos__grade">
        {urls.map((u, k) => (
          <div key={u} className="mf-fotos__item">
            <img src={u} alt="" />
            <button
              type="button"
              aria-label="Remover foto"
              onClick={() => onMudar(arquivos.filter((_, i) => i !== k))}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {cabe > 0 && (
          <label className="mf-fotos__add">
            <ImagePlus size={22} />
            <span>Escolher da galeria</span>
            <input
              type="file"
              accept="image/*"
              multiple={cabe > 1}
              onChange={(e) => {
                const novos = Array.from(e.target.files ?? []).slice(0, cabe);
                onMudar([...arquivos, ...novos]);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );
}

function GravarAudio({
  audio,
  onMudar,
}: {
  audio: Blob | null;
  onMudar: (b: Blob | null) => void;
}) {
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const rec = useRef<MediaRecorder | null>(null);
  const url = useMemo(() => (audio ? URL.createObjectURL(audio) : ""), [audio]);

  useEffect(() => {
    if (!gravando) return;
    const t = window.setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [gravando]);

  const gravar = async () => {
    if (gravando) return rec.current?.stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      const partes: Blob[] = [];
      r.ondataavailable = (e) => partes.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        onMudar(new Blob(partes, { type: r.mimeType || "audio/webm" }));
        setGravando(false);
      };
      rec.current = r;
      setSegundos(0);
      r.start();
      setGravando(true);
    } catch {
      alert(
        "Não foi possível usar o microfone. Você pode enviar um arquivo de áudio.",
      );
    }
  };

  return (
    <div className="mf-audio">
      {audio ? (
        <>
          <audio controls src={url} />
          <button
            type="button"
            className="mf-btn mf-btn--leve"
            onClick={() => onMudar(null)}
          >
            <Trash2 size={16} /> Gravar de novo
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className={`mf-mic${gravando ? " on" : ""}`}
            onClick={gravar}
          >
            {gravando ? <Square size={18} /> : <Mic size={20} />}
            {gravando ? `Parar (${segundos}s)` : "Gravar áudio"}
          </button>
          <label className="mf-btn mf-btn--leve">
            ou enviar um arquivo
            <input
              type="file"
              accept="audio/*"
              hidden
              onChange={(e) => {
                const a = e.target.files?.[0];
                if (a) onMudar(a);
              }}
            />
          </label>
        </>
      )}
    </div>
  );
}

/* ------------------------------- o formulário ------------------------------- */

const ETAPAS = ["Vocês", "Fotos", "O ano de vocês", "A carta", "Revisar"];

export function Formulario() {
  const [f, setF] = useState<Form>(() => {
    const plano = lerPlano();
    try {
      const salvo = JSON.parse(
        localStorage.getItem(RASCUNHO) ?? "null",
      ) as Form | null;
      if (salvo) return { ...formVazio(plano), ...salvo, plano };
    } catch {
      /* sem rascunho */
    }
    return formVazio(plano);
  });
  const [arq, setArq] = useState<Arquivos>({});
  const [audio, setAudio] = useState<Blob | null>(null);
  const [videos, setVideos] = useState<File[]>([]);
  const [etapa, setEtapa] = useState(0);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState("");
  const [pronto, setPronto] = useState<string | null>(null);
  const [aceite, setAceite] = useState(false);
  const topo = useRef<HTMLDivElement>(null);

  const nivel = { basica: 0, completa: 1, inesquecivel: 2 }[f.plano];
  const limite = PLANOS[f.plano].fotos;
  const totalFotos = Object.values(arq).reduce(
    (n, l) => n + (l?.length ?? 0),
    0,
  );
  const restante = limite - totalFotos;

  useEffect(() => {
    try {
      localStorage.setItem(RASCUNHO, JSON.stringify(f));
    } catch {
      /* armazenamento indisponível */
    }
  }, [f]);

  /** Atualiza um campo pelo caminho, ex.: muda("musica.titulo", "x"). */
  const muda = (caminho: string, valor: unknown) =>
    setF((velho) => {
      const novo = structuredClone(velho) as unknown as Record<string, unknown>;
      const partes = caminho.split(".");
      let alvo = novo as Record<string, unknown>;
      partes
        .slice(0, -1)
        .forEach((p) => (alvo = alvo[p] as Record<string, unknown>));
      alvo[partes[partes.length - 1]!] = valor;
      return novo as unknown as Form;
    });

  const txt = (
    caminho: string,
    props: {
      placeholder?: string;
      max?: number;
      area?: boolean;
      tipo?: string;
    } = {},
  ) => {
    const valor = caminho
      .split(".")
      .reduce<unknown>(
        (o, p) => (o as Record<string, unknown>)[p],
        f,
      ) as string;
    const comum = {
      value: valor ?? "",
      placeholder: props.placeholder,
      maxLength: props.max ?? 160,
      onChange: (e: { target: { value: string } }) =>
        muda(caminho, e.target.value),
    };
    return props.area ? (
      <textarea rows={4} {...comum} />
    ) : (
      <input type={props.tipo ?? "text"} {...comum} />
    );
  };

  const espaco = (k: Espaco) => arq[k] ?? [];
  const mudaEspaco = (k: Espaco) => (lista: File[]) =>
    setArq((a) => ({ ...a, [k]: lista }));

  const validar = (): string => {
    if (etapa === 0) {
      if (!f.de.trim() || !f.para.trim())
        return "Preencha o seu nome e o nome do seu amor.";
      if (!f.juntosDesde)
        return "Conta pra gente desde quando vocês estão juntos.";
      if (f.whatsapp.replace(/\D/g, "").length < 10)
        return "Coloque o seu WhatsApp com DDD, para receber a Retrô.";
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim()))
        return "Coloque o e-mail que você usou na compra.";
    }
    if (etapa === 1 && !espaco("favorita").length)
      return "Escolha a foto favorita de vocês.";
    if (etapa === 2) {
      if (!f.musica.titulo.trim()) return "Qual foi a música do ano de vocês?";
      if (!f.lugar.nome.trim()) return "Qual foi o lugar mais marcante do ano?";
    }
    if (etapa === 3 && f.carta.trim().length < 20)
      return "Escreva a sua carta (pode ser curtinha).";
    return "";
  };

  const ir = (d: number) => {
    const e = d > 0 ? validar() : "";
    setErro(e);
    if (e) return;
    setEtapa((v) => Math.min(ETAPAS.length - 1, Math.max(0, v + d)));
    topo.current?.scrollIntoView({ behavior: "smooth" });
  };

  const enviar = async () => {
    if (!aceite)
      return setErro("Confirme que as fotos podem ser usadas na Retrô.");
    setErro("");
    try {
      const slug = novoSlug(`${f.de}-e-${f.para}`);
      const fotos: Fotos = {
        lugar: [],
        mes: [],
        mural: [],
        comeco: [],
        mesAMes: [],
        videos: [],
      };
      const todos = Object.entries(arq).flatMap(([k, l]) =>
        (l ?? []).map((a, i) => ({ k, a, i })),
      );
      let feitos = 0;
      for (const { k, a, i } of todos) {
        setEnviando(`Enviando fotos… ${++feitos} de ${todos.length}`);
        const url = await subirArquivo(
          slug,
          `${k}-${i}.jpg`,
          await comprimir(a),
        );
        if (k === "favorita" || k === "caos" || k === "antes" || k === "depois")
          fotos[k] = url;
        else if (k === "lugar" || k === "mes" || k === "mural")
          fotos[k].push(url);
        else if (k.startsWith("comeco")) fotos.comeco[Number(k.slice(6))] = url;
        else if (k.startsWith("mesames"))
          fotos.mesAMes[Number(k.slice(7))] = url;
      }
      if (nivel >= 2)
        for (const [i, v] of videos.entries()) {
          setEnviando(`Enviando vídeo ${i + 1} de ${videos.length}…`);
          const ext = v.name.split(".").pop()?.toLowerCase() || "mp4";
          fotos.videos.push(await subirArquivo(slug, `video-${i}.${ext}`, v));
        }
      if (audio && nivel >= 2) {
        setEnviando("Enviando o áudio…");
        const ext = audio.type.includes("mp4")
          ? "m4a"
          : audio.type.includes("mpeg")
            ? "mp3"
            : "webm";
        fotos.audio = await subirArquivo(slug, `carta.${ext}`, audio);
      }
      setEnviando("Montando a sua Retrô…");
      const dados = { ...montarRetro(f, fotos), extras: f.extras };
      await enviarPedido({
        slug,
        plano: f.plano,
        cliente_nome: f.de.trim(),
        cliente_whatsapp: f.whatsapp,
        cliente_email: f.email,
        dados,
      });
      localStorage.removeItem(RASCUNHO);
      setPronto(slug);
    } catch (e) {
      console.error(e);
      setErro(
        "Não conseguimos enviar agora. Confira a sua internet e tente de novo.",
      );
    } finally {
      setEnviando("");
    }
  };

  if (pronto)
    return (
      <div className="mf">
        <div className="mf-fim">
          <span className="mf-fim__ok">
            <Check size={34} />
          </span>
          <h1>Recebemos a história de vocês!</h1>
          <p>
            Agora é com a gente. Em até 48h a Retrô de {f.de} e {f.para} chega
            pronta no seu WhatsApp.
          </p>
          {modoTeste && (
            <p className="mf-teste">
              Modo de teste: <a href="../painel/">abrir o painel</a> ·{" "}
              <a href={`../r/?id=${pronto}`}>ver a Retrô</a>
            </p>
          )}
        </div>
      </div>
    );

  return (
    <div className="mf" ref={topo}>
      <header className="mf-topo">
        <a href="../" className="mf-logo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M20 35 C8 27 3 20 3 13.5 A8.5 8.5 0 0 1 20 9.5 A8.5 8.5 0 0 1 37 13.5 C37 20 32 27 20 35Z"
              fill="#D7263D"
            />
            <path
              d="M19.5 14 L12 19.5 L19.5 25Z M28 14 L20.5 19.5 L28 25Z"
              fill="#FFD23F"
            />
          </svg>
          Retrô a Dois
        </a>
        <span className="mf-plano">Plano {PLANOS[f.plano].nome}</span>
      </header>

      {modoTeste && (
        <p className="mf-teste">
          Modo de teste: os pedidos ficam guardados só neste navegador.
        </p>
      )}

      <h1 className="mf-titulo">Conte a história de vocês</h1>
      <p className="mf-sub">
        Leva uns 10 minutos. Só o que tem * é obrigatório; o resto deixa a Retrô
        ainda mais completa.
      </p>

      <ol className="mf-passos" aria-label="Etapas">
        {ETAPAS.map((e, k) => (
          <li
            key={e}
            className={k === etapa ? "atual" : k < etapa ? "feito" : ""}
          >
            <i>{k < etapa ? <Check size={12} /> : k + 1}</i>
            <span>{e}</span>
          </li>
        ))}
      </ol>

      <div className="mf-corpo">
        {etapa === 0 && (
          <Bloco titulo="Quem são vocês">
            <div className="mf-dupla">
              <Campo rotulo="Seu nome *">
                {txt("de", { placeholder: "Ana", max: 30 })}
              </Campo>
              <Campo rotulo="Nome do seu amor *">
                {txt("para", { placeholder: "Leo", max: 30 })}
              </Campo>
            </div>
            <Campo
              rotulo="Juntos desde *"
              dica="A data em que começaram a namorar (ou se conheceram)."
            >
              {txt("juntosDesde", { tipo: "date" })}
            </Campo>
            <div className="mf-dupla">
              <Campo
                rotulo="Seu WhatsApp *"
                dica="É para onde mandamos a Retrô pronta."
              >
                {txt("whatsapp", {
                  placeholder: "(11) 99999-9999",
                  tipo: "tel",
                  max: 20,
                })}
              </Campo>
              <Campo
                rotulo="E-mail usado na compra *"
                dica="O mesmo da Kiwify, para a gente localizar o seu pedido."
              >
                {txt("email", {
                  placeholder: "voce@email.com",
                  tipo: "email",
                  max: 80,
                })}
              </Campo>
            </div>
            <Campo
              rotulo="Vocês têm pet?"
              dica="O nome dele aparece como participação especial."
            >
              {txt("pet", { placeholder: "Paçoca", max: 30 })}
            </Campo>
            {nivel >= 1 && (
              <div className="mf-campo">
                <span className="mf-rotulo">Tema de cores da Retrô</span>
                <div className="mf-temas">
                  {TEMAS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={f.tema === t.id ? "on" : ""}
                      onClick={() => muda("tema", t.id)}
                      aria-pressed={f.tema === t.id}
                    >
                      <span className="mf-temas__cores" aria-hidden="true">
                        {t.cores.map((c) => (
                          <i key={c} style={{ background: c }} />
                        ))}
                      </span>
                      {t.nome}
                    </button>
                  ))}
                </div>
                <small className="mf-dica">
                  Quer ver como fica?{" "}
                  <a
                    href={`../exemplo/?tema=${f.tema}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir o exemplo neste tema
                  </a>
                </small>
              </div>
            )}
            <div className="mf-campo">
              <span className="mf-rotulo">
                Você comprou algum extra no checkout?
              </span>
              <label className="mf-aceite">
                <input
                  type="checkbox"
                  checked={f.extras.pet}
                  onChange={(e) => muda("extras.pet", e.target.checked)}
                />
                Retrô do pet
              </label>
              <label className="mf-aceite">
                <input
                  type="checkbox"
                  checked={f.extras.pedido}
                  onChange={(e) => muda("extras.pedido", e.target.checked)}
                />
                Final com pedido de namoro ou casamento
              </label>
            </div>
            {!new URLSearchParams(location.search).get("plano") && (
              <Campo rotulo="Plano">
                <select
                  value={f.plano}
                  onChange={(e) => muda("plano", e.target.value)}
                >
                  <option value="basica">Básica</option>
                  <option value="completa">Completa</option>
                  <option value="inesquecivel">Inesquecível</option>
                </select>
              </Campo>
            )}
          </Bloco>
        )}

        {etapa === 1 && (
          <>
            <p className="mf-contador">
              {totalFotos} de {limite} fotos do seu plano
            </p>
            <Bloco titulo="A foto de vocês">
              <FotoEspaco
                rotulo="A foto favorita de vocês *"
                dica="Ela abre a Retrô."
                max={1}
                arquivos={espaco("favorita")}
                onMudar={mudaEspaco("favorita")}
                restante={restante}
              />
            </Bloco>
            <Bloco titulo="O lugar mais marcante">
              <FotoEspaco
                rotulo="Fotos desse lugar"
                max={3}
                arquivos={espaco("lugar")}
                onMudar={mudaEspaco("lugar")}
                restante={restante}
              />
            </Bloco>
            {nivel >= 1 && (
              <>
                <Bloco titulo="O mês mais feliz" plano="Completa">
                  <FotoEspaco
                    rotulo="Fotos desse mês"
                    max={3}
                    arquivos={espaco("mes")}
                    onMudar={mudaEspaco("mes")}
                    restante={restante}
                  />
                </Bloco>
                <Bloco titulo="Antes e depois" plano="Completa">
                  <div className="mf-dupla">
                    <FotoEspaco
                      rotulo="Uma foto antiga"
                      max={1}
                      arquivos={espaco("antes")}
                      onMudar={mudaEspaco("antes")}
                      restante={restante}
                    />
                    <FotoEspaco
                      rotulo="Uma foto de hoje"
                      max={1}
                      arquivos={espaco("depois")}
                      onMudar={mudaEspaco("depois")}
                      restante={restante}
                    />
                  </div>
                </Bloco>
                <Bloco titulo="O momento mais caótico" plano="Completa">
                  <FotoEspaco
                    rotulo="Uma foto engraçada ou bagunçada"
                    max={1}
                    arquivos={espaco("caos")}
                    onMudar={mudaEspaco("caos")}
                    restante={restante}
                  />
                </Bloco>
                <Bloco titulo="Mural do ano" plano="Completa">
                  <FotoEspaco
                    rotulo="Fotos variadas do dia a dia"
                    max={6}
                    arquivos={espaco("mural")}
                    onMudar={mudaEspaco("mural")}
                    restante={restante}
                  />
                </Bloco>
              </>
            )}
          </>
        )}

        {etapa === 2 && (
          <>
            <Bloco titulo="Os números do ano">
              <p className="mf-dica">
                Os dias juntos a gente calcula sozinho. Quer contar mais algum
                número?
              </p>
              {f.numeros.map((_, k) => (
                <div className="mf-dupla mf-num" key={k}>
                  <Campo rotulo="Quantos">
                    {txt(`numeros.${k}.valor`, {
                      placeholder: "1.284",
                      max: 9,
                    })}
                  </Campo>
                  <Campo rotulo="De quê">
                    {txt(`numeros.${k}.rotulo`, {
                      placeholder: "cafés da manhã juntos",
                      max: 40,
                    })}
                  </Campo>
                </div>
              ))}
            </Bloco>
            <Bloco titulo="A música do ano">
              <div className="mf-dupla">
                <Campo rotulo="Música *">
                  {txt("musica.titulo", {
                    placeholder: "Velha Infância",
                    max: 60,
                  })}
                </Campo>
                <Campo rotulo="Artista">
                  {txt("musica.artista", {
                    placeholder: "Tribalistas",
                    max: 60,
                  })}
                </Campo>
              </div>
              <Campo rotulo="Uma frase sobre ela">
                {txt("musica.detalhe", {
                  placeholder: "Tocou 312 vezes no carro.",
                  max: 100,
                })}
              </Campo>
            </Bloco>
            <Bloco titulo="O lugar mais marcante">
              <div className="mf-dupla">
                <Campo rotulo="Lugar *">
                  {txt("lugar.nome", { placeholder: "Praia do Rosa", max: 50 })}
                </Campo>
                <Campo rotulo="Cidade ou estado">
                  {txt("lugar.regiao", {
                    placeholder: "Santa Catarina",
                    max: 50,
                  })}
                </Campo>
              </div>
              <Campo rotulo="Quando">
                {txt("lugar.quando", { placeholder: "julho de 2026", max: 40 })}
              </Campo>
              <Campo rotulo="Por que foi marcante">
                {txt("lugar.frase", {
                  placeholder: "Onde o celular caiu no mar…",
                  max: 140,
                })}
              </Campo>
            </Bloco>
            <Bloco titulo="A frase que mais se repetiu">
              <Campo rotulo="A frase">
                {txt("frase.texto", {
                  placeholder: "Já tô chegando.",
                  max: 60,
                })}
              </Campo>
              <div className="mf-dupla">
                <Campo rotulo="Quem mais diz">
                  <select
                    value={f.frase.quem}
                    onChange={(e) => muda("frase.quem", e.target.value)}
                  >
                    <option value="de">{f.de || "Você"}</option>
                    <option value="para">{f.para || "Seu amor"}</option>
                  </select>
                </Campo>
                <Campo rotulo="Quantas vezes, mais ou menos">
                  {txt("frase.vezes", {
                    placeholder: "umas 200 vezes",
                    max: 30,
                  })}
                </Campo>
              </div>
              <Campo
                rotulo="O que a outra pessoa responde"
                dica="Aparece numa conversa de WhatsApp."
              >
                {txt("frase.resposta", {
                  placeholder: "Sua localização ainda mostra a sua casa",
                  max: 80,
                })}
              </Campo>
            </Bloco>

            {nivel >= 1 && (
              <>
                <Bloco titulo="Como tudo começou" plano="Completa">
                  {f.comeco.map((_, k) => (
                    <div className="mf-item" key={k}>
                      <div className="mf-dupla">
                        <Campo rotulo="Quando">
                          {txt(`comeco.${k}.data`, {
                            placeholder: "março de 2021",
                            max: 30,
                          })}
                        </Campo>
                        <Campo rotulo="Momento">
                          {txt(`comeco.${k}.titulo`, {
                            placeholder: "O primeiro encontro",
                            max: 40,
                          })}
                        </Campo>
                      </div>
                      <Campo rotulo="Como foi">
                        {txt(`comeco.${k}.texto`, {
                          placeholder: "Um café que virou jantar…",
                          max: 120,
                        })}
                      </Campo>
                      <FotoEspaco
                        rotulo="Foto (opcional)"
                        max={1}
                        arquivos={espaco(`comeco${k}`)}
                        onMudar={mudaEspaco(`comeco${k}`)}
                        restante={restante}
                      />
                    </div>
                  ))}
                  {f.comeco.length < 4 && (
                    <button
                      type="button"
                      className="mf-btn mf-btn--leve"
                      onClick={() =>
                        muda("comeco", [
                          ...f.comeco,
                          { data: "", titulo: "", texto: "" },
                        ])
                      }
                    >
                      + Outro momento
                    </button>
                  )}
                </Bloco>
                <Bloco titulo="O mês mais feliz" plano="Completa">
                  <Campo rotulo="Qual mês">
                    <select
                      value={f.mesFeliz.mes}
                      onChange={(e) => muda("mesFeliz.mes", e.target.value)}
                    >
                      <option value="">Escolha</option>
                      {MESES_NOME.map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo rotulo="O que aconteceu">
                    {txt("mesFeliz.frase", {
                      placeholder: "A viagem e o aniversário…",
                      max: 140,
                    })}
                  </Campo>
                </Bloco>
                <Bloco titulo="O momento mais caótico" plano="Completa">
                  <Campo rotulo="Título">
                    {txt("caos.titulo", {
                      placeholder: "A mudança de março",
                      max: 40,
                    })}
                  </Campo>
                  {f.caos.itens.map((_, k) => (
                    <Campo key={k} rotulo={`Detalhe ${k + 1}`}>
                      {txt(`caos.itens.${k}`, {
                        placeholder:
                          [
                            "3 dias sem geladeira",
                            "1 sofá que não passou na porta",
                            "1 pizza no chão da sala",
                          ][k] ?? "",
                        max: 50,
                      })}
                    </Campo>
                  ))}
                </Bloco>
                <Bloco titulo="Antes e depois" plano="Completa">
                  <div className="mf-dupla">
                    <Campo rotulo="Ano da foto antiga">
                      {txt("antesDepois.anoAntes", {
                        placeholder: "2021",
                        max: 4,
                      })}
                    </Campo>
                    <Campo rotulo="Uma frase">
                      {txt("antesDepois.frase", {
                        placeholder: "O mesmo sorriso…",
                        max: 100,
                      })}
                    </Campo>
                  </div>
                </Bloco>
                <Bloco titulo="Top 5 do ano" plano="Completa">
                  <Campo rotulo="Top 5 de quê">
                    {txt("top5.titulo", {
                      placeholder: "Os apelidos mais usados",
                      max: 40,
                    })}
                  </Campo>
                  {f.top5.itens.map((_, k) => (
                    <div className="mf-dupla mf-num" key={k}>
                      <Campo rotulo={`${k + 1}º`}>
                        {txt(`top5.itens.${k}.nome`, {
                          placeholder: ["Mozão", "Vida", "Neném", "", ""][k],
                          max: 40,
                        })}
                      </Campo>
                      <Campo rotulo="Quantas vezes">
                        {txt(`top5.itens.${k}.vezes`, {
                          placeholder: "1.840",
                          max: 7,
                        })}
                      </Campo>
                    </div>
                  ))}
                </Bloco>
                <Bloco titulo="A playlist do ano" plano="Completa">
                  {f.playlist.map((_, k) => (
                    <div className="mf-item" key={k}>
                      <div className="mf-dupla">
                        <Campo rotulo={`Música ${k + 1}`}>
                          {txt(`playlist.${k}.titulo`, { max: 60 })}
                        </Campo>
                        <Campo rotulo="Artista">
                          {txt(`playlist.${k}.artista`, { max: 60 })}
                        </Campo>
                      </div>
                      <Campo rotulo="O momento em que tocou">
                        {txt(`playlist.${k}.momento`, {
                          placeholder: "a estrada inteira até a praia",
                          max: 60,
                        })}
                      </Campo>
                    </div>
                  ))}
                </Bloco>
                <Bloco titulo="Quiz do casal" plano="Completa">
                  {f.quiz.map((q, k) => (
                    <div className="mf-item" key={k}>
                      <Campo rotulo={`Pergunta ${k + 1}`}>
                        {txt(`quiz.${k}.pergunta`, { max: 70 })}
                      </Campo>
                      <div className="mf-dupla">
                        <Campo rotulo="Resposta certa">
                          <select
                            value={q.resposta}
                            onChange={(e) =>
                              muda(`quiz.${k}.resposta`, e.target.value)
                            }
                          >
                            <option value="de">{f.de || "Você"}</option>
                            <option value="para">{f.para || "Seu amor"}</option>
                          </select>
                        </Campo>
                        <Campo rotulo="Uma piada sobre isso">
                          {txt(`quiz.${k}.piada`, {
                            placeholder: "Em 9 de cada 10 filmes.",
                            max: 80,
                          })}
                        </Campo>
                      </div>
                    </div>
                  ))}
                  {f.quiz.length < 5 && (
                    <button
                      type="button"
                      className="mf-btn mf-btn--leve"
                      onClick={() =>
                        muda("quiz", [
                          ...f.quiz,
                          { pergunta: "", resposta: "de", piada: "" },
                        ])
                      }
                    >
                      + Outra pergunta
                    </button>
                  )}
                </Bloco>
                <Bloco titulo="Prêmios do ano" plano="Completa">
                  {f.premios.map((_, k) => (
                    <div className="mf-item" key={k}>
                      <div className="mf-dupla">
                        <Campo rotulo="Categoria">
                          {txt(`premios.${k}.categoria`, { max: 40 })}
                        </Campo>
                        <Campo rotulo="Quem ganhou">
                          {txt(`premios.${k}.vencedor`, {
                            placeholder: f.para || "Leo",
                            max: 30,
                          })}
                        </Campo>
                      </div>
                      <Campo rotulo="Por quê">
                        {txt(`premios.${k}.motivo`, {
                          placeholder: "pela lasanha que quase deu certo",
                          max: 60,
                        })}
                      </Campo>
                    </div>
                  ))}
                  {f.premios.length < 4 && (
                    <button
                      type="button"
                      className="mf-btn mf-btn--leve"
                      onClick={() =>
                        muda("premios", [
                          ...f.premios,
                          { categoria: "", vencedor: "", motivo: "" },
                        ])
                      }
                    >
                      + Outro prêmio
                    </button>
                  )}
                </Bloco>
                <Bloco titulo={`Sonhos para ${ANO + 1}`} plano="Completa">
                  {f.sonhos.map((_, k) => (
                    <Campo key={k} rotulo={`Sonho ${k + 1}`}>
                      {txt(`sonhos.${k}`, {
                        placeholder: [
                          "Conhecer a neve juntos",
                          "Acertar a receita da lasanha",
                          "Adotar um cachorro",
                        ][k],
                        max: 40,
                      })}
                    </Campo>
                  ))}
                </Bloco>
                <Bloco titulo="O ano mês a mês" plano="Completa">
                  <p className="mf-dica">
                    Uma frase (e, se quiser, uma foto) para cada mês. Pode pular
                    os meses que quiser.
                  </p>
                  {MESES_NOME.map((m, k) => (
                    <div className="mf-item" key={m}>
                      <Campo rotulo={m}>
                        {txt(`mesAMes.${k}`, {
                          placeholder:
                            k === 0 ? "Réveillon na casa da Júlia…" : "",
                          max: 90,
                        })}
                      </Campo>
                      <FotoEspaco
                        rotulo="Foto do mês (opcional)"
                        max={1}
                        arquivos={espaco(`mesames${k}`)}
                        onMudar={mudaEspaco(`mesames${k}`)}
                        restante={restante}
                      />
                    </div>
                  ))}
                </Bloco>
                <Bloco titulo="O mapa do ano" plano="Completa">
                  <Campo
                    rotulo="Lugares que vocês visitaram"
                    dica="Um por linha, na ordem em que foram. De 2 a 7 lugares."
                  >
                    {txt("mapaLugares", {
                      area: true,
                      max: 300,
                      placeholder: "São Paulo\nCampos do Jordão\nPraia do Rosa",
                    })}
                  </Campo>
                  <Campo rotulo="Quantos km percorreram juntos (mais ou menos)">
                    {txt("mapaKm", { placeholder: "2.340", max: 7 })}
                  </Campo>
                </Bloco>
                <Bloco titulo="A previsão do tempo do amor" plano="Completa">
                  {f.previsao.map((pv, k) => (
                    <div className="mf-item" key={k}>
                      <div className="mf-dupla">
                        <Campo rotulo="Mês">
                          <select
                            value={pv.mes}
                            onChange={(e) =>
                              muda(`previsao.${k}.mes`, e.target.value)
                            }
                          >
                            <option value="">Escolha</option>
                            {MESES_NOME.map((m) => (
                              <option key={m}>{m}</option>
                            ))}
                          </select>
                        </Campo>
                        <Campo rotulo="Tempo">
                          <select
                            value={pv.tempo}
                            onChange={(e) =>
                              muda(`previsao.${k}.tempo`, e.target.value)
                            }
                          >
                            <option value="sol">Sol</option>
                            <option value="nublado">Nublado</option>
                            <option value="chuva">Chuva</option>
                            <option value="tempestade">Tempestade</option>
                            <option value="arcoiris">Arco-íris</option>
                          </select>
                        </Campo>
                      </div>
                      <Campo rotulo="A previsão">
                        {txt(`previsao.${k}.texto`, {
                          placeholder:
                            [
                              "Ensolarado, com pancadas de ciúme.",
                              "Tempestade de caixas de mudança.",
                              "Céu limpo na praia. Felicidade máxima.",
                            ][k] ?? "",
                          max: 90,
                        })}
                      </Campo>
                    </div>
                  ))}
                  {f.previsao.length < 5 && (
                    <button
                      type="button"
                      className="mf-btn mf-btn--leve"
                      onClick={() =>
                        muda("previsao", [
                          ...f.previsao,
                          { mes: "", tempo: "sol", texto: "" },
                        ])
                      }
                    >
                      + Outro mês
                    </button>
                  )}
                </Bloco>
                <Bloco titulo="Primeiras vezes do ano" plano="Completa">
                  <Campo rotulo="Uma por linha" dica="Até 8.">
                    {txt("primeiras", {
                      area: true,
                      max: 400,
                      placeholder:
                        "Primeira viagem só nós dois\nPrimeiro Natal com a família dele",
                    })}
                  </Campo>
                </Bloco>
                <Bloco titulo="O cardápio do casal" plano="Completa">
                  <Campo rotulo="Restaurante favorito">
                    {txt("cardapio.restaurante", {
                      placeholder: "o japonês da esquina",
                      max: 50,
                    })}
                  </Campo>
                  <Campo rotulo="Prato da casa">
                    {txt("cardapio.prato", {
                      placeholder: "a lasanha (quase) perfeita",
                      max: 50,
                    })}
                  </Campo>
                  <Campo rotulo="Delivery mais pedido">
                    {txt("cardapio.delivery", {
                      placeholder: "pizza de calabresa",
                      max: 50,
                    })}
                  </Campo>
                  <Campo rotulo="Sobremesa">
                    {txt("cardapio.sobremesa", {
                      placeholder: "brigadeiro de panela",
                      max: 50,
                    })}
                  </Campo>
                  <Campo rotulo="Drink da casa">
                    {txt("cardapio.drink", {
                      placeholder: "café passado às 7h",
                      max: 50,
                    })}
                  </Campo>
                </Bloco>
              </>
            )}
          </>
        )}

        {etapa === 3 && (
          <>
            <Bloco titulo="A sua carta">
              <Campo
                rotulo="Escreva para o seu amor *"
                dica="Cada parágrafo vira uma linha da carta escrita à mão."
              >
                {txt("carta", {
                  area: true,
                  max: nivel >= 1 ? 1200 : 400,
                  placeholder: `${f.para || "Leo"},\nse eu pudesse escolher de novo…`,
                })}
              </Campo>
            </Bloco>
            {nivel >= 1 && (
              <Bloco titulo="Motivos para te amar" plano="Completa">
                <Campo
                  rotulo="Um motivo por linha"
                  dica="Viram bilhetinhos num pote. De 5 a 20."
                >
                  {txt("motivos", {
                    area: true,
                    max: 1500,
                    placeholder:
                      "o jeito que você canta errado no carro\no seu café de domingo",
                  })}
                </Campo>
              </Bloco>
            )}
            {f.extras.pedido && nivel < 2 && (
              <Bloco titulo="O seu pedido" plano="Extra">
                <Campo
                  rotulo="Escreva o pedido"
                  dica="Aparece no final da Retrô, com os botões de resposta."
                >
                  {txt("pergunta", {
                    placeholder: `${f.para || "Rafa"}, quer casar comigo?`,
                    max: 60,
                  })}
                </Campo>
              </Bloco>
            )}
            {nivel >= 2 && (
              <>
                <Bloco titulo="A carta em áudio" plano="Inesquecível">
                  <p className="mf-dica">
                    Grave você lendo a carta (ou um recado). Ele toca junto com
                    a carta.
                  </p>
                  <GravarAudio audio={audio} onMudar={setAudio} />
                </Bloco>
                <Bloco titulo="Contrato do amor" plano="Inesquecível">
                  <Campo
                    rotulo="Promessas para o próximo ano"
                    dica="Uma por linha, até 6. Seu amor assina com o dedo."
                  >
                    {txt("contrato", {
                      area: true,
                      max: 500,
                      placeholder:
                        "Lavar a louça às terças\nNão dar spoiler da série",
                    })}
                  </Campo>
                </Bloco>
                <Bloco titulo="Vídeos curtos" plano="Inesquecível">
                  <p className="mf-dica">
                    Até 3 vídeos de até 15 segundos (máx. 30 MB cada). Aparecem
                    como cenas na Retrô.
                  </p>
                  {videos.map((v, k) => (
                    <div className="mf-item" key={v.name + k}>
                      <div className="mf-video">
                        <span>{v.name}</span>
                        <button
                          type="button"
                          className="mf-btn mf-btn--leve"
                          onClick={() =>
                            setVideos(videos.filter((_, i) => i !== k))
                          }
                        >
                          <X size={14} /> Remover
                        </button>
                      </div>
                      <Campo rotulo="Legenda">
                        {txt(`videoLegendas.${k}`, {
                          placeholder: "o primeiro mergulho",
                          max: 40,
                        })}
                      </Campo>
                    </div>
                  ))}
                  {videos.length < 3 && (
                    <label className="mf-btn mf-btn--leve">
                      + Adicionar vídeo
                      <input
                        type="file"
                        accept="video/*"
                        hidden
                        onChange={(e) => {
                          const v = e.target.files?.[0];
                          e.target.value = "";
                          if (!v) return;
                          if (v.size > 30 * 1024 * 1024)
                            return setErro(
                              "Esse vídeo passou de 30 MB. Tente um trecho mais curto.",
                            );
                          setErro("");
                          setVideos([...videos, v]);
                        }}
                      />
                    </label>
                  )}
                </Bloco>
                <Bloco
                  titulo="Recados de amigos e família"
                  plano="Inesquecível"
                >
                  {f.recados.map((_, k) => (
                    <div className="mf-item" key={k}>
                      <div className="mf-dupla">
                        <Campo rotulo="De quem">
                          {txt(`recados.${k}.de`, {
                            placeholder: "Júlia",
                            max: 30,
                          })}
                        </Campo>
                        <Campo rotulo="Quem é">
                          {txt(`recados.${k}.quem`, {
                            placeholder: "irmã da Ana",
                            max: 30,
                          })}
                        </Campo>
                      </div>
                      <Campo rotulo="O recado">
                        {txt(`recados.${k}.texto`, { area: true, max: 200 })}
                      </Campo>
                    </div>
                  ))}
                  {f.recados.length < 3 && (
                    <button
                      type="button"
                      className="mf-btn mf-btn--leve"
                      onClick={() =>
                        muda("recados", [
                          ...f.recados,
                          { de: "", quem: "", texto: "" },
                        ])
                      }
                    >
                      + Outro recado
                    </button>
                  )}
                </Bloco>
                <Bloco
                  titulo="Vales-presente de raspadinha"
                  plano="Inesquecível"
                >
                  {f.vales.map((_, k) => (
                    <div className="mf-dupla" key={k}>
                      <Campo rotulo={`Vale ${k + 1}`}>
                        {txt(`vales.${k}.titulo`, {
                          placeholder: [
                            "Um café na cama",
                            "Uma massagem",
                            "Um jantar",
                          ][k],
                          max: 30,
                        })}
                      </Campo>
                      <Campo rotulo="Detalhe">
                        {txt(`vales.${k}.detalhe`, {
                          placeholder: [
                            "com pão de queijo",
                            "de 20 minutos",
                            "onde você escolher",
                          ][k],
                          max: 40,
                        })}
                      </Campo>
                    </div>
                  ))}
                </Bloco>
                <Bloco titulo="Cápsula do tempo" plano="Inesquecível">
                  <Campo
                    rotulo="Uma mensagem para abrir no futuro"
                    dica="Fica trancada com cadeado e contagem regressiva até a data."
                  >
                    {txt("capsula.mensagem", { area: true, max: 500 })}
                  </Campo>
                  <Campo rotulo="Abre em">
                    {txt("capsula.abre", { tipo: "date" })}
                  </Campo>
                </Bloco>
                <Bloco
                  titulo={f.extras.pedido ? "O seu pedido" : "A pergunta final"}
                  plano="Inesquecível"
                >
                  <Campo
                    rotulo="A pergunta"
                    dica="O botão 'Não' foge quando seu amor tenta tocar."
                  >
                    {txt("pergunta", { max: 60 })}
                  </Campo>
                </Bloco>
              </>
            )}
          </>
        )}

        {etapa === 4 && (
          <Bloco titulo="Tudo certo?">
            <ul className="mf-resumo">
              <li>
                <b>Casal:</b> {f.de} e {f.para}
              </li>
              <li>
                <b>Plano:</b> {PLANOS[f.plano].nome}
              </li>
              <li>
                <b>Fotos:</b> {totalFotos}
              </li>
              <li>
                <b>Música:</b> {f.musica.titulo}{" "}
                {f.musica.artista && `· ${f.musica.artista}`}
              </li>
              <li>
                <b>Lugar:</b> {f.lugar.nome}
              </li>
              <li>
                <b>Entrega:</b> no WhatsApp {f.whatsapp}, em até 48h
              </li>
            </ul>
            <label className="mf-aceite">
              <input
                type="checkbox"
                checked={aceite}
                onChange={(e) => setAceite(e.target.checked)}
              />
              As fotos e os textos são nossos (ou temos permissão) e podem ser
              usados na nossa Retrô.
            </label>
          </Bloco>
        )}

        {erro && (
          <p className="mf-erro" role="alert">
            {erro}
          </p>
        )}

        <div className="mf-nav">
          {etapa > 0 && (
            <button
              type="button"
              className="mf-btn mf-btn--leve"
              onClick={() => ir(-1)}
              disabled={!!enviando}
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          )}
          {etapa < ETAPAS.length - 1 ? (
            <button type="button" className="mf-btn" onClick={() => ir(1)}>
              Continuar <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="mf-btn"
              onClick={enviar}
              disabled={!!enviando}
            >
              {enviando || "Enviar a nossa história"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
