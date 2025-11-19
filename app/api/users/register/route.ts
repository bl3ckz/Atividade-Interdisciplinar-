// app/api/users/register/route.ts
// POST /api/users/register
// Validates input with Zod, hashes password with bcrypt, stores user in MongoDB via Mongoose

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import connectDB from '../../../../lib/db';
import User from '../../../../models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RegisterSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = RegisterSchema.safeParse(json);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Dados inválidos';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, password } = parsed.data;

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail }).lean();
    if (exists) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const created = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return NextResponse.json(
      {
        success: true,
        // Mongoose disponibiliza 'id' como string, evitando cast de _id
        data: { id: created.id, name: created.name, email: created.email },
      },
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Register route error:', err);
    // Do not leak details to clients
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
