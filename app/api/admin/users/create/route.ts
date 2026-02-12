import prisma from "@/lib/prisma"; // (default export)
import { sendStagiaireLoginEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, prenom, nom } = body;

    if (!email) {
      return NextResponse.json({ error: "Email obligatoire" }, { status: 400 });
    }

    const fullName = `${prenom ?? ""} ${nom ?? ""}`.trim() || null;

    // 1) role record لازم يكون موجود (stagiaire)
    const role = await prisma.role.upsert({
      where: { name: "stagiaire" },
      update: {},
      create: { name: "stagiaire" },
    });

    // 2) generate + hash password
    const rawPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 3) create user with roleId
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        roleId: role.id,
        isValidated: true, // ولا خليه false حسب المنطق متاعك
      },
    });

    // 4) send email with RAW password
    await sendStagiaireLoginEmail({
      to: user.email,
      prenom: prenom ?? user.name ?? "",
      email: user.email,
      password: rawPassword,
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (err: any) {
    console.error("Create user error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
