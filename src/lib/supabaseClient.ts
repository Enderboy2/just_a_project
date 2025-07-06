// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vqccoigtbqzrwfutboln.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2NvaWd0YnF6cndmdXRib2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjEwNDksImV4cCI6MjA2NzEzNzA0OX0.r0BivzmZS2CREKkmo3-DNZEMXTXiJOKB9fWxW9WB5Oo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
