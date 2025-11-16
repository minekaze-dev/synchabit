import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvfsacsrfrguniotjhvp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2ZnNhY3NyZnJndW5pb3RqaHZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODY1OTYsImV4cCI6MjA3ODg2MjU5Nn0.Gc-6LYiA7pBp5Xw49WV4ZHEtepLcY28_U9P48jR32aE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
