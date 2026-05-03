import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../../artifacts/anchor/public/audio");
const VOICE_ID = "nf4MCGNSdM0hxM95ZBQR";
const API_KEY = process.env.ELEVENLABS_API_KEY;

if (!API_KEY) {
  console.error("ELEVENLABS_API_KEY not set");
  process.exit(1);
}

const scripts = {
  "scattered-1m": `You don't have to gather everything right now. Just this breath. Breathe in slowly... hold gently... and let it go. Nothing needs to be figured out in this moment. The scattered feeling will settle. Just breathe in... hold... and release. You're already here. That's enough.`,

  "scattered-3m": `Your mind is moving quickly. That's okay. You don't need to slow every thought — just this breath. Breathe in... hold... and release. Each exhale is a small letting go. You don't have to solve anything right now. Just be here, with this breath, and then the next. Let the air come in slowly... hold it softly... and release. The scattered feeling doesn't need to be fixed. It just needs a little space. Keep breathing. In... hold... and out. Notice how the air fills you. Notice how the release feels. Nothing else is required of you right now. Breathe in... hold gently... and let it go. You're doing it.`,

  "paralyzed-1m": `When everything feels like too much, start here. Just one breath. In slowly... hold... and out. You don't have to do everything. Just this. Breathe in... hold... and release. One breath at a time. That's all. You're still here, and that matters.`,

  "paralyzed-3m": `When everything feels too heavy, you don't have to lift it all right now. Just breathe. In slowly... hold gently... and let it flow out. Whatever is overwhelming you — it doesn't need your attention in this moment. This moment is just for breathing. Let the air fill you slowly... hold it... and release. With each exhale, a little weight softens. You're still here. That's enough. Keep breathing in... hold... and out. You don't have to be okay right now. You don't have to have it together. Just this breath, and then the next. In... hold... and release. Right now, breathing is enough.`,

  "buzzing-1m": `There's a lot of energy moving through you. Let the breath absorb some of it. In slowly... hold... and a long, slow release. Notice how the exhale is longer — that's intentional. It helps things settle. In... hold... and out. You can rest right here for a moment.`,

  "buzzing-3m": `There's a lot of energy running through you. You don't have to fight it. Just breathe into it. In slowly... hold... and a long, slow release. Let the breath absorb some of that energy. The exhale is longer than the inhale — that's on purpose. It helps the nervous system settle. Breathe in... hold softly... and a slow, full exhale. Each cycle, the buzz softens a little. You're not stuck — you're just breathing. In... hold... and out. Keep going. Notice the pause between the exhale and the next inhale. That quiet moment. That's yours. In... hold gently... and out. You're doing it.`,
};

async function generate(slug, text) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.72,
        similarity_boost: 0.55,
        style: 0,
        use_speaker_boost: false,
        speed: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`${slug}: HTTP ${res.status} — ${err}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(OUT_DIR, `${slug}.mp3`);
  fs.writeFileSync(dest, buf);
  console.log(`✓ ${slug}.mp3  ${(buf.length / 1024).toFixed(0)} KB`);
}

for (const [slug, text] of Object.entries(scripts)) {
  await generate(slug, text);
}
console.log("Done.");
