import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSiteUrl = (currentPath = '/') => {
    const isLocalhost = process.env.NODE_ENV === 'development';
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (isLocalhost
        ? `http://localhost:3000${currentPath}`
        : process.env.NEXT_PUBLIC_VERCEL_URL ||
          `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${currentPath}`);
    
    return siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  };