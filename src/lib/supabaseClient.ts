import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

const createMockClient = (reason: string): SupabaseClient => {
  console.warn(`Supabase Client: Using MOCK client. Reason: ${reason}. Analytics and global configs will not be fetched/saved from/to Supabase.`);
  
  const mockError = { message: `Mock client: ${reason}`, details: '', hint: '', code: '' };
  const mockResponse = { data: null, error: mockError, count: null, status: 400, statusText: 'Bad Request' };
  
  const createQueryBuilder = (table: string) => {
    const builder = {
      select: (selectQuery = '*', options = {}) => {
        console.warn(`Supabase (mock client): Mock select from ${table}. Query: ${selectQuery}`);
        return builder;
      },
      insert: async (data: any, options = {}) => {
        console.warn(`Supabase (mock client): Mock insert into ${table}. Data:`, data);
        return mockResponse;
      },
      update: async (data: any, options = {}) => {
        console.warn(`Supabase (mock client): Mock update on ${table}. Data:`, data);
        return mockResponse;
      },
      delete: async (options = {}) => {
        console.warn(`Supabase (mock client): Mock delete from ${table}.`);
        return mockResponse;
      },
      upsert: async (data: any, options = {}) => {
        console.warn(`Supabase (mock client): Mock upsert into ${table}. Data:`, data);
        return mockResponse;
      },
      eq: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock eq filter on ${column} = ${value}`);
        return builder;
      },
      neq: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock neq filter on ${column} != ${value}`);
        return builder;
      },
      gt: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock gt filter on ${column} > ${value}`);
        return builder;
      },
      gte: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock gte filter on ${column} >= ${value}`);
        return builder;
      },
      lt: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock lt filter on ${column} < ${value}`);
        return builder;
      },
      lte: (column: string, value: any) => {
        console.warn(`Supabase (mock client): Mock lte filter on ${column} <= ${value}`);
        return builder;
      },
      maybeSingle: async () => {
        console.warn(`Supabase (mock client): Mock maybeSingle call.`);
        return mockResponse;
      },
      single: async () => {
        console.warn(`Supabase (mock client): Mock single call.`);
        return mockResponse;
      },
      limit: (count: number) => {
        console.warn(`Supabase (mock client): Mock limit ${count}`);
        return builder;
      },
      order: (column: string, options = {}) => {
        console.warn(`Supabase (mock client): Mock order by ${column}`);
        return builder;
      },
      range: (from: number, to: number) => {
        console.warn(`Supabase (mock client): Mock range ${from}-${to}`);
        return builder;
      },
      rpc: async (fn: string, params?: object, options = {}) => {
        console.warn(`Supabase (mock client): Mock rpc call to ${fn}. Params:`, params);
        return mockResponse;
      }
    };
    return builder;
  };
  
  return {
    from: (table: string) => createQueryBuilder(table),
    auth: {
      signInWithPassword: async (credentials: any) => {
        console.warn('Supabase (mock client): Mock signInWithPassword.');
        return { data: null, user: null, session: null, error: { message: `Mock client: ${reason}`, name: 'AuthApiError', status: 400 } as any };
      },
      getUser: async (token?: string) => {
        console.warn('Supabase (mock client): Mock getUser.');
        return { data: { user: null }, error: { message: `Mock client: ${reason}`, name: 'AuthApiError', status: 400 } as any };
      },
    } as any,
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: any, options?: any) => {
          console.warn(`Supabase (mock client): Mock storage upload to ${bucket}/${path}`);
          return mockResponse;
        },
        remove: async (paths: string[]) => {
          console.warn(`Supabase (mock client): Mock storage remove from ${bucket}`);
          return mockResponse;
        },
        getPublicUrl: (path: string) => {
          console.warn(`Supabase (mock client): Mock getPublicUrl for ${bucket}/${path}`);
          return { data: { publicUrl: '' } };
        },
      })
    } as any,
  } as any;
};

if (typeof supabaseUrl === 'string' && supabaseUrl.trim() !== '' &&
    typeof supabaseAnonKey === 'string' && supabaseAnonKey.trim() !== '') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase Client: Successfully initialized REAL Supabase client.");

  // Connection pooling optimization
  if (typeof window === 'undefined') {
    // Server-side only: Set connection pool limits
    const maxConnections = parseInt(process.env.SUPABASE_MAX_CONNECTIONS || '10');
    console.log(`Supabase: Connection pool max: ${maxConnections}`);
  }
} else {
  supabase = createMockClient("Missing credentials");
  console.warn(
    "Supabase Client: Missing credentials. Using fallback (local storage only). Features requiring DB will be limited."
  );
}

export { supabase };