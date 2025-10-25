// This file now uses the backend API instead of Supabase
import { supabaseBackend } from '../backend/client';
import type { Database } from '../mongodb/types';

// Export the backend client as supabase for compatibility
export const supabase = supabaseBackend;