import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Fetch all data from the 'scores' table
    const { data: leaderboard, error: fetchError } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false }); // Optional: Order by score, descending

    // Check if there was an error during the fetch
    if (fetchError) {
      console.error('Error fetching data:', fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        {
          status: 400, // Bad Request for invalid data
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the leaderboard data if successful
    return new Response(
      JSON.stringify({ success: true, leaderboard }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    // Catch any other errors that occur during the process
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};