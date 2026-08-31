"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export type LoginState = { error?: string; success?: true };

export async function loginAction(
  prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  const isValid =
    admin && (await bcrypt.compare(parsed.data.password, admin.passwordHash));

  if (!isValid) {
    return { error: "E-posta veya şifre hatalı." };
  }

  const token = await createSessionToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role,
  });
  await setSessionCookie(token);

  return { success: true };
}

export async function logoutAction() {
  "use server";
  await clearSessionCookie();
  redirect("/admin/login");
}

