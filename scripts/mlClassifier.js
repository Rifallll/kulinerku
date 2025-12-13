import SimpleNeuralNetwork from './simpleNN.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// TEXT VECTORIZATION (Simple but effective)
// ============================================================

/**
 * Convert text to numerical features
 * Uses character n-grams for simplicity
 */
function textToVector(text, maxLength = 50) {
    const normalized = text.toLowerCase().trim();
    const vector = {};

    // Character-level features (more robust than word-level for food names)
    for (let i = 0; i < Math.min(normalized.length, maxLength); i++) {
        const char = normalized[i];
        const key = `char_${i}_${char}`;
        vector[key] = 1;
    }

    // Bigram features
    for (let i = 0; i < Math.min(normalized.length - 1, maxLength - 1); i++) {
        const bigram = normalized.substring(i, i + 2);
        const key = `bigram_${bigram}`;
        vector[key] = (vector[key] || 0) + 0.5;
    }

    // Trigram features
    for (let i = 0; i < Math.min(normalized.length - 2, maxLength - 2); i++) {
        const trigram = normalized.substring(i, i + 3);
        const key = `trigram_${trigram}`;
        vector[key] = (vector[key] || 0) + 0.3;
    }

    // Key word features (domain-specific)
    const keywords = {
        // Beverages
        'es': 1, 'kopi': 1, 'teh': 1, 'jus': 1, 'susu': 1,
        'wedang': 1, 'bajigur': 1, 'bandrek': 1, 'jamu': 1,
        'cendol': 1, 'dawet': 1, 'cincau': 1,
        // Foods
        'nasi': 1, 'ayam': 1, 'sate': 1, 'mie': 1, 'mi': 1,
        'soto': 1, 'bakso': 1, 'rendang': 1, 'gulai': 1,
        'tahu': 1, 'tempe': 1, 'pecel': 1, 'gado': 1
    };

    for (const [keyword, weight] of Object.entries(keywords)) {
        if (normalized.includes(keyword)) {
            vector[`keyword_${keyword}`] = weight;
        }
    }

    return vector;
}

// ============================================================
// NEURAL NETWORK CLASSIFIER
// ============================================================

class MLClassifier {
    constructor() {
        // Determine feature size from vectorization
        const sampleVector = textToVector("sample");
        const featureSize = Object.keys(sampleVector).length;

        this.network = new SimpleNeuralNetwork(
            featureSize,  // input size
            20,           // hidden layer size
            2,            // output size (makanan, minuman)
            0.3           // learning rate
        );
        this.trained = false;
        this.modelPath = path.join(process.cwd(), 'models', 'classifier.json');
        this.featureKeys = null; // Will be set during training
    }

    /**
     * Convert object vector to array for neural network
     */
    vectorToArray(vector) {
        if (!this.featureKeys) {
            // First time - establish feature keys
            this.featureKeys = Object.keys(vector).sort();
        }

        const array = [];
        for (const key of this.featureKeys) {
            array.push(vector[key] || 0);
        }
        return array;
    }

    /**
     * Auto-train from database
     */
    async autoTrain() {
        console.log('🤖 AUTO-TRAINING: Fetching data from database...');

        const { data: items, error } = await supabase
            .from('food_items')
            .select('name, type');

        if (error) throw error;

        console.log(`📊 Found ${items.length} items for training`);

        // Prepare training data - convert to arrays
        const rawData = items
            .filter(item => ['Makanan', 'Minuman'].includes(item.type))
            .map(item => ({
                vector: textToVector(item.name),
                type: item.type
            }));

        // Establish feature keys from first item
        if (rawData.length > 0) {
            this.featureKeys = Object.keys(rawData[0].vector).sort();
        }

        const trainingData = rawData.map(item => ({
            input: this.vectorToArray(item.vector),
            output: [
                item.type === 'Makanan' ? 1 : 0,  // makanan
                item.type === 'Minuman' ? 1 : 0   // minuman
            ]
        }));

        console.log(`✅ Prepared ${trainingData.length} training examples`);
        console.log(`   - Makanan: ${trainingData.filter(d => d.output[0] === 1).length}`);
        console.log(`   - Minuman: ${trainingData.filter(d => d.output[1] === 1).length}`);

        // Train
        console.log('\n🧠 Training neural network...');
        this.network.train(trainingData, 1000);

        console.log(`\n✅ Training complete!`);

        this.trained = true;

        // Auto-save model
        await this.saveModel();

        return { iterations: 1000 };
    }

    /**
     * Predict classification
     */
    predict(itemName) {
        if (!this.trained) {
            throw new Error('Model not trained! Run autoTrain() first.');
        }

        const vector = textToVector(itemName);
        const inputArray = this.vectorToArray(vector);
        const output = this.network.predict(inputArray);

        const makananScore = output[0] || 0;
        const minumanScore = output[1] || 0;

        const type = makananScore > minumanScore ? 'Makanan' : 'Minuman';
        const confidence = Math.max(makananScore, minumanScore);

        return {
            type,
            confidence,
            scores: {
                makanan: makananScore,
                minuman: minumanScore
            }
        };
    }

    /**
     * Auto-save model
     */
    async saveModel() {
        const modelDir = path.dirname(this.modelPath);
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir, { recursive: true });
        }

        const modelData = {
            network: this.network.toJSON(),
            featureKeys: this.featureKeys
        };
        fs.writeFileSync(this.modelPath, JSON.stringify(modelData, null, 2));

        console.log(`💾 Model saved to: ${this.modelPath}`);
    }

    /**
     * Auto-load model
     */
    async loadModel() {
        if (!fs.existsSync(this.modelPath)) {
            console.log('⚠️  No saved model found. Will auto-train...');
            return false;
        }

        const modelData = JSON.parse(fs.readFileSync(this.modelPath, 'utf8'));
        this.network.fromJSON(modelData.network);
        this.featureKeys = modelData.featureKeys;
        this.trained = true;

        console.log(`✅ Model loaded from: ${this.modelPath}`);
        return true;
    }

    /**
     * Evaluate model accuracy
     */
    async evaluate() {
        console.log('\n📊 Evaluating model accuracy...');

        const { data: items, error } = await supabase
            .from('food_items')
            .select('name, type')
            .in('type', ['Makanan', 'Minuman']);

        if (error) throw error;

        let correct = 0;
        let total = items.length;
        const confusionMatrix = {
            makanan: { correct: 0, total: 0, wrongAsMinuman: 0 },
            minuman: { correct: 0, total: 0, wrongAsMakanan: 0 }
        };

        for (const item of items) {
            const prediction = this.predict(item.name);
            const actualType = item.type;

            if (prediction.type === actualType) {
                correct++;
                if (actualType === 'Makanan') {
                    confusionMatrix.makanan.correct++;
                } else {
                    confusionMatrix.minuman.correct++;
                }
            } else {
                if (actualType === 'Makanan') {
                    confusionMatrix.makanan.wrongAsMinuman++;
                } else {
                    confusionMatrix.minuman.wrongAsMakanan++;
                }
            }

            if (actualType === 'Makanan') {
                confusionMatrix.makanan.total++;
            } else {
                confusionMatrix.minuman.total++;
            }
        }

        const accuracy = (correct / total * 100).toFixed(2);
        const makananAccuracy = (confusionMatrix.makanan.correct / confusionMatrix.makanan.total * 100).toFixed(2);
        const minumanAccuracy = (confusionMatrix.minuman.correct / confusionMatrix.minuman.total * 100).toFixed(2);

        console.log(`\n✅ Overall Accuracy: ${accuracy}% (${correct}/${total})`);
        console.log(`   Makanan: ${makananAccuracy}% (${confusionMatrix.makanan.correct}/${confusionMatrix.makanan.total})`);
        console.log(`   Minuman: ${minumanAccuracy}% (${confusionMatrix.minuman.correct}/${confusionMatrix.minuman.total})`);

        if (confusionMatrix.makanan.wrongAsMinuman > 0) {
            console.log(`   ⚠️  ${confusionMatrix.makanan.wrongAsMinuman} Makanan misclassified as Minuman`);
        }
        if (confusionMatrix.minuman.wrongAsMakanan > 0) {
            console.log(`   ⚠️  ${confusionMatrix.minuman.wrongAsMakanan} Minuman misclassified as Makanan`);
        }

        return {
            accuracy: parseFloat(accuracy),
            makananAccuracy: parseFloat(makananAccuracy),
            minumanAccuracy: parseFloat(minumanAccuracy),
            confusionMatrix
        };
    }
}

// ============================================================
// EXPORT
// ============================================================

export default MLClassifier;
export { textToVector };
