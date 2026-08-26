// URL et Clé publique Supabase
const supabaseUrl = 'https://dmfbjpotgicqpfxlsycv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtZmJqcG90Z2ljcXBmeGxzeWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDIyNjYsImV4cCI6MjEwMzMxODI2Nn0.WbVuFOdEEaWGSrn3hb8hHLi9Tvzw8AHotc42Q7XH1JE';

// Initialisation du client Supabase
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

console.log("Supabase est connecté !");
