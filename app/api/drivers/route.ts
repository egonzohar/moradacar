import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { driverApplications } from "@/db/schema";
import { ensureDbReady } from "@/lib/db-init";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbReady();
    const drivers = await db
      .select()
      .from(driverApplications)
      .orderBy(desc(driverApplications.createdAt))
      .limit(12);

    return NextResponse.json({
      drivers,
      totalCooperativeMembers: 480 + drivers.length,
    });
  } catch (error) {
    console.error("Error fetching driver applications:", error);
    return NextResponse.json(
      { error: "Erro ao consultar motoristas cooperados." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbReady();
    const body = await req.json();
    const {
      fullName,
      whatsapp,
      email,
      neighborhood,
      vehicleModel,
      vehicleYear,
      currentApps,
      weeklyRidesEstimate,
    } = body;

    if (!fullName || !whatsapp || !neighborhood || !vehicleModel) {
      return NextResponse.json(
        { error: "Preencha nome completo, WhatsApp, bairro de Araraquara e veículo." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(driverApplications)
      .values({
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim(),
        email: (email && email.trim()) || "contato@moradacar.coop.br",
        neighborhood: neighborhood.trim(),
        vehicleModel: vehicleModel.trim(),
        vehicleYear: (vehicleYear && String(vehicleYear).trim()) || "2022",
        currentApps: (currentApps && currentApps.trim()) || "Uber / 99",
        weeklyRidesEstimate: Number(weeklyRidesEstimate) || 90,
        status: "pre_aprovado",
      })
      .returning();

    return NextResponse.json(
      {
        application: created,
        protocol: `MC-ARA-${new Date().getFullYear()}-${String(created.id).padStart(4, "0")}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting driver application:", error);
    return NextResponse.json(
      { error: "Não foi possível registrar seu cadastro de motorista cooperado." },
      { status: 500 }
    );
  }
}

