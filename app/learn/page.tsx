import { redirect } from "next/navigation";
import { getDailyPoem } from "@/lib/db/poems";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const poem = await getDailyPoem();

  if (!poem) {
    redirect("/");
  }

  redirect(`/poems/${poem.id}/test`);
}
