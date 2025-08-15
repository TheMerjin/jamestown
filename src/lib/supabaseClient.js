import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zrncemjjaldkqzzgftqk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybmNlbWpqYWxka3F6emdmdHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNDYwNTYsImV4cCI6MjA3MDYyMjA1Nn0.oSsg068GNKP9ts48rXbc10hPTBsT7E7CDQPoRxsFtA0';

export const supabase = createClient(supabaseUrl, supabaseKey);