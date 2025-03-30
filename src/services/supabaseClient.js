import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfxfzxfzjiaegisnxzna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmeGZ6eGZ6amlhZWdpc254em5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyOTU5OTIsImV4cCI6MjA1ODg3MTk5Mn0.QKttNdYnOPL_pWJJlRCx5bKRXmEgDZZYYKlsoHZds-A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
