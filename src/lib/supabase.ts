import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://ynjitewfecaofqcjkizj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inluaml0ZXdmZWNhb2ZxY2praXpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTU1MTMsImV4cCI6MjA1NDQ5MTUxM30.ikEhIYeMtCJacH1JVyNxIemqTukQ6NoRakidcAHTziE';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);