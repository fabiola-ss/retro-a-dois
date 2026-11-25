/* Mais quatro recursos da Retrô: contador de tempo juntos ao vivo,
   playlist do ano, carta em áudio e responder à Retrô. */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ExternalLink,
  Mic,
  Pause,
  Play,
  Send,
  Square,
  Trash2,
} from "lucide-react";

import { RETRO } from "./dados";

/* ------------------------- contador ao vivo ------------------------- */

export function JuntosAoVivo() {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setAgora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const ms = Math.max(0, agora - RETRO.juntosDesdeData.getTime());
  const partes = [
    [Math.floor(ms / 86400000), "dias"],
    [Math.floor(ms / 3600000) % 24, "horas"],
    [Math.floor(ms / 60000) % 60, "min"],
    [Math.floor(ms / 1000) % 60, "seg"],
  ] as const;
  return (
    <div className="rx-aovivo" role="timer" aria-label="Tempo juntos">
      <span className="rx-aovivo__rotulo">
        <i aria-hidden="true" /> Juntos há
      </span>
      <div className="rx-aovivo__nums">
        {partes.map(([v, l]) => (
          <span key={l}>
            <b key={v}>
              {l === "dias"
                ? v.toLocaleString("pt-BR")
                : String(v).padStart(2, "0")}
            </b>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- playlist do ano --------------------------- */

const spotify = (titulo: string, artista: string) =>
  `https://open.spotify.com/search/${encodeURIComponent(`${titulo} ${artista}`)}`;

export function Playlist({ on }: { on: boolean }) {
  return (
    <>
      <p className="rx-kicker rx-a">A trilha sonora de {RETRO.ano}</p>
      <div
        className="rx-fita rx-a"
        style={{ "--d": 1 } as CSSProperties}
        aria-hidden="true"
      >
        <span className="rx-fita__etiqueta">
          {RETRO.de} &amp; {RETRO.para} · Lado A
        </span>
        <span className={`rx-fita__rolo${on ? " gira" : ""}`} />
        <span className={`rx-fita__rolo dir${on ? " gira" : ""}`} />
      </div>
      <ol className="rx-faixas">
        {RETRO.playlist.map((m, k) => (
          <li
            key={m.titulo}
            className="rx-a"
            style={{ "--d": k + 2 } as CSSProperties}
          >
            <span className="rx-faixas__n">{k + 1}</span>
            <span className="rx-faixas__info">
              <b>{m.titulo}</b>
              <small>{m.artista}</small>
              <em>{m.momento}</em>
            </span>
            <a
              href={spotify(m.titulo, m.artista)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Ouvir ${m.titulo} no Spotify`}
            >
              <ExternalLink size={16} />
            </a>
          </li>
        ))}
      </ol>
    </>
  );
}

/* ---------------------------- carta em áudio ---------------------------- */

/** Avisa a trilha de fundo para abaixar enquanto a voz toca. */
const avisarVoz = (tocando: boolean) =>
  window.dispatchEvent(new CustomEvent("rx-voz", { detail: tocando }));

export function CartaAudio() {
  const texto = RETRO.carta.join(" ");
  const arquivo = RETRO.cartaAudio;
  const audio = useRef<HTMLAudioElement | null>(null);
  const [tocando, setTocando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  /* clientes: só aparece no plano Inesquecível e se houver áudio gravado */
  const tem = RETRO.ehExemplo
    ? !!arquivo ||
      (typeof window !== "undefined" && "speechSynthesis" in window)
    : !!arquivo && RETRO.plano === "inesquecivel";
  const [duracao, setDuracao] = useState(() =>
    Math.round(texto.split(" ").length / 2.4),
  );

  /* com áudio gravado, mostra a duração real */
  useEffect(() => {
    if (!arquivo) return;
    const a = new Audio(arquivo);
    a.preload = "metadata";
    a.onloadedmetadata = () => {
      if (Number.isFinite(a.duration)) setDuracao(Math.round(a.duration));
    };
  }, [arquivo]);

  useEffect(
    () => () => {
      audio.current?.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      avisarVoz(false);
    },
    [],
  );

  const parar = () => {
    audio.current?.pause();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setTocando(false);
    avisarVoz(false);
  };

  const tocar = () => {
    if (tocando) return parar();
    setTocando(true);
    setProgresso(0);
    avisarVoz(true);
    if (arquivo) {
      /* na Retrô de verdade: o áudio gravado por quem deu o presente */
      audio.current = audio.current ?? new Audio(arquivo);
      audio.current.ontimeupdate = () =>
        setProgresso(
          audio.current!.currentTime / (audio.current!.duration || 1),
        );
      audio.current.onended = parar;
      void audio.current.play();
      return;
    }
    /* no exemplo: uma voz do próprio aparelho lê a carta */
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    const voz = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("pt"));
    if (voz) fala.voice = voz;
    const palavras = texto.length;
    fala.onboundary = (e) => setProgresso(e.charIndex / palavras);
    fala.onend = () => {
      setProgresso(1);
      parar();
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(fala);
  };

  if (!tem) return null;
  return (
    <div className="rx-audio rx-a" style={{ "--d": 2 } as CSSProperties}>
      <button
        type="button"
        className="rx-audio__play"
        onClick={tocar}
        aria-label={
          tocando
            ? "Pausar o áudio da carta"
            : `Ouvir a carta na voz de ${RETRO.de}`
        }
      >
        {tocando ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <span className="rx-audio__onda" aria-hidden="true">
        {Array.from({ length: 28 }, (_, k) => (
          <i
            key={k}
            className={k / 28 <= progresso ? "tocou" : ""}
            style={
              { "--h": `${30 + ((k * 37) % 70)}%`, "--k": k } as CSSProperties
            }
          />
        ))}
      </span>
      <span className="rx-audio__info">
        <b>Áudio de {RETRO.de}</b>
        <small>
          {Math.floor(duracao / 60)}:{String(duracao % 60).padStart(2, "0")}
          {!arquivo && " · voz de exemplo"}
        </small>
      </span>
      {RETRO.ehExemplo && <span className="rx-audio__plano">Inesquecível</span>}
    </div>
  );
}

/* --------------------------- responder à Retrô --------------------------- */

export function Responder() {
  const [texto, setTexto] = useState("");
  const [gravando, setGravando] = useState(false);
  const [gravacao, setGravacao] = useState<Blob | null>(null);
  const [aviso, setAviso] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const pedacos = useRef<Blob[]>([]);
  const podeGravar =
    typeof window !== "undefined" &&
    "MediaRecorder" in window &&
    !!navigator.mediaDevices?.getUserMedia;

  const whatsapp = () => {
    const msg = texto.trim() || `Acabei de ver a nossa Retrô. Eu te amo! ❤`;
    const numero = RETRO.whatsappDe.replace(/\D/g, "");
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  };

  const gravar = async () => {
    if (gravando) {
      rec.current?.stop();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      pedacos.current = [];
      r.ondataavailable = (e) => pedacos.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setGravacao(
          new Blob(pedacos.current, { type: r.mimeType || "audio/webm" }),
        );
        setGravando(false);
      };
      rec.current = r;
      r.start();
      setGravando(true);
      setAviso("");
    } catch {
      setAviso(
        "Não deu para usar o microfone. Você pode responder por escrito.",
      );
    }
  };

  const enviarAudio = async () => {
    if (!gravacao) return;
    const ext = gravacao.type.includes("mp4") ? "m4a" : "webm";
    const arq = new File(
      [gravacao],
      `resposta-para-${RETRO.de.toLowerCase()}.${ext}`,
      {
        type: gravacao.type,
      },
    );
    const nav = navigator as Navigator & {
      canShare?: (d: ShareData) => boolean;
    };
    if (nav.canShare?.({ files: [arq] })) {
      try {
        await nav.share({ files: [arq], title: `Resposta para ${RETRO.de}` });
        return;
      } catch {
        /* cancelou */
      }
    }
    const url = URL.createObjectURL(gravacao);
    const a = document.createElement("a");
    a.href = url;
    a.download = arq.name;
    a.click();
    URL.revokeObjectURL(url);
    setAviso(`Áudio salvo. É só mandar para ${RETRO.de} no WhatsApp.`);
  };

  return (
    <>
      <p className="rx-kicker rx-a">Sua vez, {RETRO.para}</p>
      <h2 className="rx-titulo rx-a" style={{ "--d": 1 } as CSSProperties}>
        Responda para {RETRO.de}
      </h2>
      <div className="rx-resp rx-a" style={{ "--d": 2 } as CSSProperties}>
        <label htmlFor="rx-resp-txt" className="rx-resp__rotulo">
          Escreva o que você sentiu
        </label>
        <textarea
          id="rx-resp-txt"
          rows={4}
          maxLength={600}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`${RETRO.de}, eu não acredito que você fez isso…`}
        />
        <button type="button" className="rx-btn" onClick={whatsapp}>
          <Send size={16} /> Enviar pelo WhatsApp
        </button>

        {podeGravar && (
          <div className="rx-resp__voz">
            <span>ou mande um áudio</span>
            {!gravacao ? (
              <button
                type="button"
                className={`rx-resp__mic${gravando ? " gravando" : ""}`}
                onClick={gravar}
                aria-label={gravando ? "Parar de gravar" : "Gravar um áudio"}
              >
                {gravando ? <Square size={18} /> : <Mic size={20} />}
              </button>
            ) : (
              <div className="rx-resp__pronto">
                <audio controls src={URL.createObjectURL(gravacao)} />
                <div>
                  <button
                    type="button"
                    className="rx-btn rx-btn--amarelo"
                    onClick={enviarAudio}
                  >
                    <Send size={16} /> Enviar áudio
                  </button>
                  <button
                    type="button"
                    className="rx-resp__apagar"
                    onClick={() => setGravacao(null)}
                    aria-label="Apagar e gravar de novo"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
            {gravando && (
              <small className="rx-resp__rec">Gravando… toque para parar</small>
            )}
          </div>
        )}
        {aviso && (
          <p className="rx-resp__aviso" role="status">
            {aviso}
          </p>
        )}
      </div>
    </>
  );
}
