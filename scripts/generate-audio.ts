import { spawnSync } from "node:child_process";
import path from "node:path";
import { sampleJsonPath } from "@/lib/paths";

const pythonScript = path.join(process.cwd(), "services", "tts", "generate_audio.py");
const result = spawnSync("conda", ["run", "-n", "tangshi300", "python", pythonScript, "--input", sampleJsonPath], {
  cwd: process.cwd(),
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
