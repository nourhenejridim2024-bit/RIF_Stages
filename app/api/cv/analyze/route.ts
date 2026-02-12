import { NextResponse } from "next/server";
import { analyzeCV } from "@/lib/cv-analysis-service";

export async function POST(req: Request) {
  try {
    const { cvText, candidateName, departement } = await req.json();

    if (!cvText || !candidateName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const analysis = await analyzeCV(cvText, candidateName, departement ?? "Général");
    return NextResponse.json({ analysis });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
