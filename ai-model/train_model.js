const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { Matrix } = require('ml-matrix');
const MLR = require('ml-regression-multivariate-linear');

class RecommendationModel {
    constructor() {
        this.model = null;
        this.encoders = {
            userProfile: {},
            roomType: {},
            season: {},
            dayType: {}
        };
        this.scaler = {
            mean: {},
            std: {}
        };
    }

    async loadData() {
        console.log('📊 Loading training data...');

        return new Promise((resolve, reject) => {
            const data = [];
            fs.createReadStream('./ai-model/dataset/user_interactions.csv')
                .pipe(csv())
                .on('data', (row) => {
                    data.push({
                        userId: parseInt(row.user_id),
                        userProfile: row.user_profile,
                        roomType: row.room_type,
                        season: row.season,
                        dayType: row.day_type,
                        bookingAdvance: parseInt(row.booking_advance_days),
                        stayDuration: parseInt(row.stay_duration_nights),
                        groupSize: parseInt(row.group_size),
                        rating: parseInt(row.user_rating),
                        wasBooked: parseInt(row.was_booked),
                        viewTime: parseInt(row.view_time_seconds),
                        compatibilityScore: parseFloat(row.compatibility_score)
                    });
                })
                .on('end', () => {
                    console.log(`✅ Loaded ${data.length} training samples`);
                    resolve(data);
                })
                .on('error', reject);
        });
    }

    prepareData(data) {
        console.log('🔧 Preparing and encoding data...');

        // Create encoders for categorical variables
        const uniqueValues = {
            userProfile: [...new Set(data.map(d => d.userProfile))],
            roomType: [...new Set(data.map(d => d.roomType))],
            season: [...new Set(data.map(d => d.season))],
            dayType: [...new Set(data.map(d => d.dayType))]
        };

        // Create one-hot encoders
        Object.keys(uniqueValues).forEach(key => {
            uniqueValues[key].forEach((value, index) => {
                this.encoders[key][value] = index;
            });
        });

        // Prepare features and targets
        const features = [];
        const targets = [];

        data.forEach(sample => {
            const feature = [
                // One-hot encoded categorical features
                ...this.oneHotEncode(sample.userProfile, this.encoders.userProfile, uniqueValues.userProfile.length),
                ...this.oneHotEncode(sample.roomType, this.encoders.roomType, uniqueValues.roomType.length),
                ...this.oneHotEncode(sample.season, this.encoders.season, uniqueValues.season.length),
                ...this.oneHotEncode(sample.dayType, this.encoders.dayType, uniqueValues.dayType.length),

                // Numerical features
                sample.bookingAdvance / 90, // Normalize to 0-1
                sample.stayDuration / 7,    // Normalize to 0-1
                sample.groupSize / 8,       // Normalize to 0-1
                sample.viewTime / 300       // Normalize to 0-1
            ];

            features.push(feature);
            targets.push([sample.compatibilityScore, sample.wasBooked, sample.rating / 5]);
        });

        console.log(`📐 Feature vector size: ${features[0].length}`);
        console.log(`🎯 Target vector size: ${targets[0].length}`);

        return {
            features: features,
            targets: targets,
            featureSize: features[0].length,
            encoders: this.encoders
        };
    }

    oneHotEncode(value, encoder, size) {
        const encoded = new Array(size).fill(0);
        if (encoder[value] !== undefined) {
            encoded[encoder[value]] = 1;
        }
        return encoded;
    }

    createModel(features, targets) {
        console.log('🏗️ Building machine learning models...');

        // Create separate models for each target
        const compatibilityModel = new MLR(features, targets.map(t => [t[0]]));
        const bookingModel = new MLR(features, targets.map(t => [t[1]]));
        const ratingModel = new MLR(features, targets.map(t => [t[2]]));

        console.log('📋 Models created: Compatibility, Booking Probability, Rating Prediction');

        return {
            compatibilityModel,
            bookingModel,
            ratingModel
        };
    }

    trainModel(features, targets) {
        console.log('🚀 Starting model training...');

        // Split data into train/validation
        const splitIndex = Math.floor(features.length * 0.8);

        const trainFeatures = features.slice(0, splitIndex);
        const trainTargets = targets.slice(0, splitIndex);
        const valFeatures = features.slice(splitIndex);
        const valTargets = targets.slice(splitIndex);

        console.log(`📊 Training samples: ${trainFeatures.length}, Validation samples: ${valFeatures.length}`);

        // Create and train models
        const models = this.createModel(trainFeatures, trainTargets);

        console.log('✅ Training completed!');

        this.models = models;
        return { trainFeatures, trainTargets, valFeatures, valTargets };
    }

    saveModel() {
        console.log('💾 Saving trained model...');

        // Create models directory
        const modelDir = './ai-model/models';
        if (!fs.existsSync(modelDir)) {
            fs.mkdirSync(modelDir, { recursive: true });
        }

        // Save the models
        const modelData = {
            compatibilityModel: this.models.compatibilityModel.toJSON(),
            bookingModel: this.models.bookingModel.toJSON(),
            ratingModel: this.models.ratingModel.toJSON()
        };

        fs.writeFileSync(
            path.join(modelDir, 'models.json'),
            JSON.stringify(modelData, null, 2)
        );

        // Also save to the correct path for the server
        const serverModelDir = '../ai-model/models';
        if (!fs.existsSync(serverModelDir)) {
            fs.mkdirSync(serverModelDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(serverModelDir, 'models.json'),
            JSON.stringify(modelData, null, 2)
        );

        // Save encoders and metadata
        const metadata = {
            encoders: this.encoders,
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            description: 'Room recommendation model for Hotelogix (Lightweight ML)',
            algorithm: 'Multivariate Linear Regression'
        };

        fs.writeFileSync(
            path.join(modelDir, 'metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        // Also save metadata to the correct path for the server
        fs.writeFileSync(
            path.join(serverModelDir, 'metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        console.log('✅ Model saved successfully!');
        console.log(`📁 Model files saved to: ${path.resolve(modelDir)}`);
    }

    evaluateModel(valFeatures, valTargets) {
        console.log('📊 Evaluating model performance...');

        // Make predictions
        const compatibilityPreds = this.models.compatibilityModel.predict(valFeatures).map(p => p[0]);
        const bookingPreds = this.models.bookingModel.predict(valFeatures).map(p => p[0]);
        const ratingPreds = this.models.ratingModel.predict(valFeatures).map(p => p[0]);

        // Calculate MAE for each model
        const compatibilityMAE = valTargets.reduce((sum, target, i) =>
            sum + Math.abs(target[0] - compatibilityPreds[i]), 0) / valTargets.length;
        const bookingMAE = valTargets.reduce((sum, target, i) =>
            sum + Math.abs(target[1] - bookingPreds[i]), 0) / valTargets.length;
        const ratingMAE = valTargets.reduce((sum, target, i) =>
            sum + Math.abs(target[2] - ratingPreds[i]), 0) / valTargets.length;

        console.log(`📈 Compatibility MAE: ${compatibilityMAE.toFixed(4)}`);
        console.log(`📈 Booking Probability MAE: ${bookingMAE.toFixed(4)}`);
        console.log(`📈 Rating Prediction MAE: ${ratingMAE.toFixed(4)}`);
        console.log(`📈 Average MAE: ${((compatibilityMAE + bookingMAE + ratingMAE) / 3).toFixed(4)}`);
    }
}

// Main training function
async function trainRecommendationModel() {
    try {
        const model = new RecommendationModel();

        // Load and prepare data
        const rawData = await model.loadData();
        const { features, targets } = model.prepareData(rawData);

        // Train the model
        const { trainFeatures, trainTargets, valFeatures, valTargets } = model.trainModel(features, targets);

        // Evaluate the model
        model.evaluateModel(valFeatures, valTargets);

        // Save the model
        model.saveModel();

        console.log('🎉 Model training completed successfully!');

    } catch (error) {
        console.error('❌ Training failed:', error);
    }
}

// Run training if this file is executed directly
if (require.main === module) {
    trainRecommendationModel();
}

module.exports = RecommendationModel;