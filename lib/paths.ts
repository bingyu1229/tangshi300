import path from "node:path";

export const projectRoot = process.cwd();
export const dataDir = process.env.TANGSHI_DATA_DIR
  ? path.resolve(process.env.TANGSHI_DATA_DIR)
  : path.join(projectRoot, "data");
export const databasePath = process.env.TANGSHI_DATABASE_PATH
  ? path.resolve(process.env.TANGSHI_DATABASE_PATH)
  : path.join(dataDir, "tangshi300.sqlite");
export const sourceXmlPath = path.join(projectRoot, "tangshi300.xml");
export const fullJsonPath = path.join(dataDir, "tangshi300.json");
export const sampleJsonPath = path.join(dataDir, "tangshi300-v1-sample.json");
export const audioPublicDir = path.join(projectRoot, "public", "audio");
