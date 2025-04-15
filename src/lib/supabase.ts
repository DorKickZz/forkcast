import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqxndygmnlqasxqzcyuh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeG5keWdtbmxxYXN4cXpjeXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTI2MzUsImV4cCI6MjA2MDE4ODYzNX0.IkI_Vup88LpImqlzH5fPu3RBK8qf4QYhlHVzacCJBMc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
