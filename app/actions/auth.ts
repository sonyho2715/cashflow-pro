'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { loginSchema, registerSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validated = loginSchema.parse({ email, password });

    const user = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const passwordMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!passwordMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name || undefined;
    session.role = user.role;
    session.plan = user.plan;
    session.isLoggedIn = true;
    await session.save();

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function register(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    const validated = registerSchema.parse({ email, password, name });

    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    const passwordHash = await bcrypt.hash(validated.password, 12);

    const user = await db.user.create({
      data: {
        email: validated.email,
        passwordHash,
        name: validated.name,
      },
    });

    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name || undefined;
    session.role = user.role;
    session.plan = user.plan;
    session.isLoggedIn = true;
    await session.save();

    return { success: true };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/');
}

export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
