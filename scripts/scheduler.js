import cron from 'node-cron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * AUTOMATED SCHEDULER
 * Runs real-time data updates automatically
 */

console.log('🤖 AUTOMATED SCHEDULER STARTED');
console.log('================================\n');

// Schedule 1: Daily trending scraping at 2 AM
cron.schedule('0 2 * * *', async () => {
    console.log('\n⏰ [2 AM] Running daily trending scraping...');
    try {
        const { stdout, stderr } = await execAsync('node scripts/realDataScraper.js');
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error('❌ Scraping failed:', error.message);
    }
});

// Schedule 2: ML auto-healing every 6 hours
cron.schedule('0 */6 * * *', async () => {
    console.log('\n⏰ [Every 6 hours] Running ML auto-healing...');
    try {
        const { stdout, stderr } = await execAsync('node scripts/mlAutoHeal.js');
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error('❌ Auto-healing failed:', error.message);
    }
});

// Schedule 3: ML retraining weekly (Sunday 3 AM)
cron.schedule('0 3 * * 0', async () => {
    console.log('\n⏰ [Sunday 3 AM] Retraining ML model...');
    try {
        const { stdout, stderr } = await execAsync('node scripts/mlAutoTrain.js');
        console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error) {
        console.error('❌ Retraining failed:', error.message);
    }
});

console.log('📅 Scheduled tasks:');
console.log('   - Daily trending scraping: 2 AM');
console.log('   - ML auto-healing: Every 6 hours');
console.log('   - ML retraining: Sunday 3 AM');
console.log('\n✅ Scheduler is running...\n');

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\n\n👋 Scheduler stopped');
    process.exit(0);
});
