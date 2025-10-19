import cron from 'node-cron';
import { fetchEnrichedPools } from './defillama';
import { supabase } from '../supabase';

let isRunning = false;

export async function updatePoolsData() {
  if (isRunning) {
    console.log('⏭️  Pool update already running, skipping...');
    return;
  }

  try {
    isRunning = true;
    console.log('🔄 Starting pool data update...');
    
    const pools = await fetchEnrichedPools();
    
    console.log(`💾 Upserting ${pools.length} pools to database...`);
    
    // Upsert pools in batches
    const batchSize = 100;
    for (let i = 0; i < pools.length; i += batchSize) {
      const batch = pools.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('pools')
        .upsert(batch, { 
          onConflict: 'pool_id',
          ignoreDuplicates: false 
        });

      if (error) {
        console.error(`❌ Error upserting batch ${i / batchSize + 1}:`, error);
      } else {
        console.log(`✅ Upserted batch ${i / batchSize + 1} (${batch.length} pools)`);
      }
    }

    console.log('✅ Pool data update completed successfully');
  } catch (error) {
    console.error('❌ Error updating pools data:', error);
  } finally {
    isRunning = false;
  }
}

export function startScheduler() {
  console.log('⏰ Starting pool data scheduler (runs every 6 hours)...');
  
  // Run immediately on startup
  updatePoolsData();
  
  // Schedule to run every 6 hours
  cron.schedule('0 */6 * * *', () => {
    console.log('⏰ Scheduled pool update triggered');
    updatePoolsData();
  });

  console.log('✅ Scheduler started successfully');
}
