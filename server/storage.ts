import { type User, type InsertUser, type Pool } from "@shared/schema";
import { randomUUID } from "crypto";
import { supabase } from "./supabase";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pool methods
  getPools(filters?: {
    chain?: string;
    protocol?: string;
    minRiskScore?: number;
    minAPY?: number;
  }): Promise<Pool[]>;
  getPoolById(id: string): Promise<Pool | undefined>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }

    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching user by username:', error);
      return undefined;
    }

    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([insertUser])
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }

    return data as User;
  }

  async getPools(filters?: {
    chain?: string;
    protocol?: string;
    minRiskScore?: number;
    minAPY?: number;
  }): Promise<Pool[]> {
    let query = supabase.from('pools').select('*');

    if (filters?.chain) {
      query = query.eq('chain', filters.chain);
    }

    if (filters?.protocol) {
      query = query.ilike('protocol', `%${filters.protocol}%`);
    }

    if (filters?.minRiskScore) {
      query = query.gte('risk_score', filters.minRiskScore);
    }

    if (filters?.minAPY) {
      query = query.gte('apy', filters.minAPY);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error fetching pools:', error);
      return [];
    }

    return (data || []) as Pool[];
  }

  async getPoolById(id: string): Promise<Pool | undefined> {
    const { data, error } = await supabase
      .from('pools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching pool:', error);
      return undefined;
    }

    return data as Pool;
  }
}

export const storage = new SupabaseStorage();
