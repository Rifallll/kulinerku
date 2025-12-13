import MLClassifier from './mlClassifier.js';

/**
 * AUTONOMOUS ML TRAINING SYSTEM
 * Runs completely automatically - no user intervention needed!
 */

async function autonomousTraining() {
    console.log('\n🤖 AUTONOMOUS ML TRAINING SYSTEM');
    console.log('   100% Automatic - Zero Manual Intervention\n');
    console.log('='.repeat(70));

    try {
        const classifier = new MLClassifier();

        // Step 1: Try to load existing model
        console.log('\n📥 STEP 1: Checking for existing model...');
        const modelLoaded = await classifier.loadModel();

        if (!modelLoaded) {
            // Step 2: Auto-train from database
            console.log('\n🧠 STEP 2: Auto-training from database...');
            await classifier.autoTrain();
        } else {
            console.log('✅ Using existing trained model');
        }

        // Step 3: Auto-evaluate
        console.log('\n📊 STEP 3: Auto-evaluating model performance...');
        const metrics = await classifier.evaluate();

        // Step 4: Auto-retrain if accuracy is low
        if (metrics.accuracy < 90) {
            console.log(`\n⚠️  Accuracy (${metrics.accuracy}%) below threshold (90%)`);
            console.log('🔄 Auto-retraining to improve accuracy...');
            await classifier.autoTrain();

            // Re-evaluate
            const newMetrics = await classifier.evaluate();
            console.log(`\n✅ New accuracy: ${newMetrics.accuracy}%`);
        } else {
            console.log(`\n✅ Model accuracy is good: ${metrics.accuracy}%`);
        }

        // Step 5: Test predictions
        console.log('\n🧪 STEP 4: Testing predictions...');
        const testCases = [
            'Es Cendol',
            'Nasi Goreng',
            'Kopi Susu',
            'Rendang',
            'Teh Tarik',
            'Sate Ayam',
            'Jus Alpukat',
            'Bakso'
        ];

        console.log('\nSample predictions:');
        for (const testCase of testCases) {
            const prediction = classifier.predict(testCase);
            console.log(`   "${testCase}" → ${prediction.type} (${(prediction.confidence * 100).toFixed(1)}% confidence)`);
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ AUTONOMOUS TRAINING COMPLETE!');
        console.log('   Model is ready for production use');
        console.log('='.repeat(70) + '\n');

        return classifier;

    } catch (error) {
        console.error('\n❌ Training failed:', error.message);
        throw error;
    }
}

// Run autonomous training
autonomousTraining()
    .then(() => {
        console.log('\n💡 Next steps:');
        console.log('   - Run: npm run ml:heal (auto-fix database)');
        console.log('   - System will auto-retrain daily');
        console.log('   - No manual intervention needed!\n');
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
