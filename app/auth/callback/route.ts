import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  // Supabase auth-helpers will set cookies via middleware internally.
  // We just redirect to dashboard or home.
  return NextResponse.redirect(new URL('/dashboard', url.origin));
}
