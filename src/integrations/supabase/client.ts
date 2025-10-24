// This file now uses MongoDB instead of Supabase
import mongodb from '../mongodb/mongodb';
import type { Database } from '../mongodb/types';

// Export the MongoDB client as supabase for compatibility
export const supabase = mongodb;