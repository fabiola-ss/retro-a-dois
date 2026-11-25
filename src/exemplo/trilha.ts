/* Trilha instrumental original, gerada no próprio navegador (Web Audio).
   Uma caixinha de música suave sobre acordes lentos. Por ser composta aqui,
   não tem nenhum problema de direitos autorais. */

type Trilha = {
  ligar: () => void;
  desligar: () => void;
  ligada: () => boolean;
};

export function criarTrilha(): Trilha {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let timer = 0;
  let on = false;
  let passo = 0;

  // Dó maior: C – G – Am – F, 4 tempos cada, a 76 bpm
  const acordes = [
    [261.63, 329.63, 392.0],
    [196.0, 246.94, 293.66],
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
  ];
  const melodia = [
    [659.25, 783.99, 523.25, 783.99],
    [587.33, 783.99, 493.88, 587.33],
    [523.25, 659.25, 880.0, 659.25],
    [523.25, 698.46, 659.25, 587.33],
  ];
  const tempo = 60 / 76;

  const nota = (
    freq: number,
    inicio: number,
    dur: number,
    vol: number,
    tipo: OscillatorType,
  ) => {
    if (!ctx || !master) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = tipo;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, inicio);
    g.gain.linearRampToValueAtTime(vol, inicio + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, inicio + dur);
    o.connect(g).connect(master);
    o.start(inicio);
    o.stop(inicio + dur + 0.05);
  };

  const agendar = () => {
    if (!ctx) return;
    const agora = ctx.currentTime;
    const c = Math.floor(passo / 4) % 4;
    const t = passo % 4;
    const inicio = agora + 0.05;
    if (t === 0)
      acordes[c]!.forEach((f) =>
        nota(f / 2, inicio, tempo * 4.2, 0.05, "triangle"),
      );
    nota(melodia[c]![t]!, inicio, tempo * 1.6, 0.06, "sine");
    nota(melodia[c]![t]! * 2, inicio, tempo * 0.6, 0.012, "sine");
    passo++;
  };

  return {
    ligar() {
      if (on) return;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = ctx ?? new AC();
      void ctx.resume();
      if (!master) {
        master = ctx.createGain();
        const filtro = ctx.createBiquadFilter();
        filtro.type = "lowpass";
        filtro.frequency.value = 2400;
        const eco = ctx.createDelay();
        eco.delayTime.value = tempo * 0.75;
        const ecoVol = ctx.createGain();
        ecoVol.gain.value = 0.28;
        master.connect(filtro).connect(ctx.destination);
        filtro.connect(eco).connect(ecoVol).connect(filtro);
      }
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);
      on = true;
      agendar();
      timer = window.setInterval(agendar, tempo * 1000);
    },
    desligar() {
      if (!on || !ctx || !master) return;
      on = false;
      window.clearInterval(timer);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    },
    ligada: () => on,
  };
}
