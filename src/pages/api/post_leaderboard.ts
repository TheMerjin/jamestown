import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabaseClient';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse the incoming JSON body
    const { name, time, score } = await request.json();

    // Insert into the 'scores' table
    const { data: game, error: insertError } = await supabase
      .from('scores')
      .insert({ player_name: name, Time: time, score : score })
      .select();

    // Check if there was an error during the insert
    if (insertError) {
      console.error('Error inserting data:', insertError);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        {
          status: 400, // Bad Request for invalid data
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // If insertion was successful, return a success message with the inserted data
    return new Response(
      JSON.stringify({ success: true, game }),
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