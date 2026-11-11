import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { ensureDbReady } from "@/lib/db-init";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbReady();
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(10);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Erro ao carregar mensagens de contato." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbReady();
    const body = await req.json();
    const { name, phone, email, profileType, neighborhood, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Por favor, preencha seu nome, WhatsApp/telefone e mensagem." },
        { status: 400 }
      );
    }

    const [saved] = await db
      .insert(contactMessages)
      .values({
        name: name.trim(),
        phone: phone.trim(),
        email: (email && email.trim()) || "atendimento@moradacar.coop.br",
        profileType: profileType || "passageiro",
        neighborhood: (neighborhood && neighborhood.trim()) || "Centro - Araraquara",
        subject: (subject && subject.trim()) || "Atendimento MORADACAR Araraquara",
        message: message.trim(),
      })
      .returning();

    return NextResponse.json(
      {
        contact: saved,
        ticketCode: `ATD-${String(saved.id).padStart(4, "0")}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem no momento." },
      { status: 500 }
    );
  }
}

