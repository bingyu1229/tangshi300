import fs from "node:fs";
import { dataDir, fullJsonPath, sampleJsonPath, sourceXmlPath } from "@/lib/paths";
import { parseTangshiXml, pickStableSample } from "@/lib/poems/import";

fs.mkdirSync(dataDir, { recursive: true });

const xml = fs.readFileSync(sourceXmlPath, "utf8");
const poems = parseTangshiXml(xml);
const sample = pickStableSample(poems, 50);

fs.writeFileSync(fullJsonPath, `${JSON.stringify(poems, null, 2)}\n`, "utf8");
fs.writeFileSync(sampleJsonPath, `${JSON.stringify(sample, null, 2)}\n`, "utf8");

const warningCount = poems.filter((poem) => !poem.notes || !poem.translation || !poem.appreciation).length;

console.log(`Parsed poems: ${poems.length}`);
console.log(`v1 sample poems: ${sample.length}`);
console.log(`Poems with missing detail sections: ${warningCount}`);
console.log(`Wrote ${fullJsonPath}`);
console.log(`Wrote ${sampleJsonPath}`);
