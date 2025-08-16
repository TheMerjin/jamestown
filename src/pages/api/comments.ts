import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const prerender = false;

// POST route: add a comment
export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, content } = await request.json();

    if (!username || !content || !content.trim()) {
      return new Response(
        JSON.stringify({ error: 'Username and content are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert({ username, content })
      .select();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, comment }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// GET route: fetch all comments
export const GET: APIRoute = async () => {
  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .order('time', { ascending: true }); // optional: newest last

    if (error) {
      console.error('Fetch error:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(comments),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};