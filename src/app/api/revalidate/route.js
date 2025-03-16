import { revalidatePath } from 'next/cache';

export async function GET(request) {
  const buildTime = new Date().toISOString();

  console.log(`Server build time during revalidation: ${buildTime}`);
  
  revalidatePath('/');
  
  return new Response(JSON.stringify({ 
    revalidated: true,
    now: buildTime
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}