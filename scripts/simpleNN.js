/**
 * SIMPLE NEURAL NETWORK - No External Dependencies!
 * Lightweight implementation for binary classification
 */

class SimpleNeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize, learningRate = 0.3) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.learningRate = learningRate;

        // Initialize weights randomly
        this.weightsInputHidden = this.randomMatrix(inputSize, hiddenSize);
        this.weightsHiddenOutput = this.randomMatrix(hiddenSize, outputSize);

        // Biases
        this.biasHidden = this.randomArray(hiddenSize);
        this.biasOutput = this.randomArray(outputSize);
    }

    randomMatrix(rows, cols) {
        const matrix = [];
        for (let i = 0; i < rows; i++) {
            matrix[i] = [];
            for (let j = 0; j < cols; j++) {
                matrix[i][j] = Math.random() * 2 - 1; // -1 to 1
            }
        }
        return matrix;
    }

    randomArray(size) {
        return Array(size).fill(0).map(() => Math.random() * 2 - 1);
    }

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    sigmoidDerivative(x) {
        return x * (1 - x);
    }

    forward(input) {
        // Input to hidden
        const hidden = [];
        for (let i = 0; i < this.hiddenSize; i++) {
            let sum = this.biasHidden[i];
            for (let j = 0; j < this.inputSize; j++) {
                sum += input[j] * this.weightsInputHidden[j][i];
            }
            hidden[i] = this.sigmoid(sum);
        }

        // Hidden to output
        const output = [];
        for (let i = 0; i < this.outputSize; i++) {
            let sum = this.biasOutput[i];
            for (let j = 0; j < this.hiddenSize; j++) {
                sum += hidden[j] * this.weightsHiddenOutput[j][i];
            }
            output[i] = this.sigmoid(sum);
        }

        return { hidden, output };
    }

    train(trainingData, iterations = 1000) {
        for (let iter = 0; iter < iterations; iter++) {
            let totalError = 0;

            for (const { input, output: target } of trainingData) {
                // Forward pass
                const { hidden, output } = this.forward(input);

                // Calculate error
                const outputError = [];
                for (let i = 0; i < this.outputSize; i++) {
                    const error = target[i] - output[i];
                    outputError[i] = error;
                    totalError += Math.abs(error);
                }

                // Backpropagation
                // Output layer gradients
                const outputGradients = [];
                for (let i = 0; i < this.outputSize; i++) {
                    outputGradients[i] = outputError[i] * this.sigmoidDerivative(output[i]);
                }

                // Hidden layer errors
                const hiddenError = [];
                for (let i = 0; i < this.hiddenSize; i++) {
                    let error = 0;
                    for (let j = 0; j < this.outputSize; j++) {
                        error += outputGradients[j] * this.weightsHiddenOutput[i][j];
                    }
                    hiddenError[i] = error;
                }

                // Hidden layer gradients
                const hiddenGradients = [];
                for (let i = 0; i < this.hiddenSize; i++) {
                    hiddenGradients[i] = hiddenError[i] * this.sigmoidDerivative(hidden[i]);
                }

                // Update weights hidden -> output
                for (let i = 0; i < this.hiddenSize; i++) {
                    for (let j = 0; j < this.outputSize; j++) {
                        this.weightsHiddenOutput[i][j] += this.learningRate * outputGradients[j] * hidden[i];
                    }
                }

                // Update weights input -> hidden
                for (let i = 0; i < this.inputSize; i++) {
                    for (let j = 0; j < this.hiddenSize; j++) {
                        this.weightsInputHidden[i][j] += this.learningRate * hiddenGradients[j] * input[i];
                    }
                }

                // Update biases
                for (let i = 0; i < this.outputSize; i++) {
                    this.biasOutput[i] += this.learningRate * outputGradients[i];
                }
                for (let i = 0; i < this.hiddenSize; i++) {
                    this.biasHidden[i] += this.learningRate * hiddenGradients[i];
                }
            }

            // Log progress
            if ((iter + 1) % 200 === 0) {
                const avgError = totalError / (trainingData.length * this.outputSize);
                console.log(`   Iteration ${iter + 1}, Error: ${avgError.toFixed(6)}`);
            }
        }
    }

    predict(input) {
        const { output } = this.forward(input);
        return output;
    }

    toJSON() {
        return {
            inputSize: this.inputSize,
            hiddenSize: this.hiddenSize,
            outputSize: this.outputSize,
            learningRate: this.learningRate,
            weightsInputHidden: this.weightsInputHidden,
            weightsHiddenOutput: this.weightsHiddenOutput,
            biasHidden: this.biasHidden,
            biasOutput: this.biasOutput
        };
    }

    fromJSON(data) {
        this.inputSize = data.inputSize;
        this.hiddenSize = data.hiddenSize;
        this.outputSize = data.outputSize;
        this.learningRate = data.learningRate;
        this.weightsInputHidden = data.weightsInputHidden;
        this.weightsHiddenOutput = data.weightsHiddenOutput;
        this.biasHidden = data.biasHidden;
        this.biasOutput = data.biasOutput;
    }
}

export default SimpleNeuralNetwork;
