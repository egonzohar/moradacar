import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { safetyTipsPosts } from "@/db/schema";
import { ensureDbReady } from "@/lib/db-init";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbReady();
    const posts = await db
      .select()
      .from(safetyTipsPosts)
      .orderBy(desc(safetyTipsPosts.helpfulCount), desc(safetyTipsPosts.id));

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching safety tips:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as dicas de segurança." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDbReady();
    const body = await req.json();

    if (body.action === "vote" && body.id) {
      const [updated] = await db
        .update(safetyTipsPosts)
        .set({
          helpfulCount: sql`${safetyTipsPosts.helpfulCount} + 1`,
        })
        .where(eq(safetyTipsPosts.id, Number(body.id)))
        .returning();

      return NextResponse.json({ post: updated });
    }

    const { title, excerpt, content, category, audience, authorName, authorRole } = body;
    if (!title || !content || !authorName) {
      return NextResponse.json(
        { error: "Título, conteúdo e nome do autor são obrigatórios." },
        { status: 400 }
      );
    }

    const slug =
      title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const [created] = await db
      .insert(safetyTipsPosts)
      .values({
        slug,
        title: title.trim(),
        excerpt:
          (excerpt && excerpt.trim()) ||
          content.trim().slice(0, 145) + (content.length > 145 ? "..." : ""),
        content: content.trim(),
        category: category || "Araraquara Local",
        audience: audience || "Ambos",
        readTime: "3 min de leitura",
        authorName: authorName.trim(),
        authorRole: (authorRole && authorRole.trim()) || "Comunidade MORADACAR Araraquara",
        badgeText: "Dica da Comunidade",
        helpfulCount: 1,
      })
      .returning();

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    console.error("Error in safety tips POST:", error);
    return NextResponse.json(
      { error: "Erro ao processar sua solicitação no blog de segurança." },
      { status: 500 }
    );
  }
}

