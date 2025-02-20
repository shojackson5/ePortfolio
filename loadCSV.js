require('dotenv').config(); // Require .env file that contains JWT token for access

const mongoose = require('mongoose');
const csvtojson = require('csvtojson');
const path = require('path');
const Animal = require('./models/Animal');


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Path to CSV file
const csvFilePath = path.join(__dirname, './data/aac_shelter_outcomes.csv');

const importCSV = async () => {
    try {
        // Convert CSV to JSON array
        const jsonArray = await csvtojson().fromFile(csvFilePath);

        let validRecords = [];
        let correctedRecords = 0;
        let duplicateRecords = 0;
        let skippedRecords = 0;

        // Process records
        for (const item of jsonArray) {
            let outcomeMonth = Number(item.outcome_month);
            let outcomeYear = Number(item.outcome_year);

            // Default values if missing
            if (isNaN(outcomeMonth)) {
                outcomeMonth = 1;  // Default to January
                correctedRecords++;
            }
            if (isNaN(outcomeYear)) {
                outcomeYear = 2000; // Default to Year 2000
                correctedRecords++;
            }

            // Skip empty records
            if (!item.name && !item.breed) {
                skippedRecords++;
                continue;
            }

            // Check if record already exists (Prevent duplicates)
            const existingAnimal = await Animal.findOne({
                name: item.name,
                breed: item.breed,
                age_upon_outcome_in_weeks: Number(item.age_upon_outcome_in_weeks),
                sex_upon_outcome: item.sex_upon_outcome,
                outcome_type: item.outcome_type,
                outcome_month: outcomeMonth,
                outcome_year: outcomeYear
            });

            if (existingAnimal) {
                duplicateRecords++;
                continue; // Skip inserting duplicate record
            }

            // Add unique valid record
            validRecords.push({
                name: item.name || "Unknown",
                breed: item.breed || "Unknown",
                age_upon_outcome_in_weeks: Number(item.age_upon_outcome_in_weeks) || 0,
                sex_upon_outcome: item.sex_upon_outcome || "Unknown",
                outcome_subtype: item.outcome_subtype || "Unknown",
                outcome_type: item.outcome_type || "Unknown",
                outcome_month: outcomeMonth,
                outcome_year: outcomeYear
            });
        }

        // Insert non-duplicate records into MongoDB
        if (validRecords.length > 0) {
            await Animal.insertMany(validRecords);
            console.log(`Successfully imported ${validRecords.length} records`);
        }

        console.log(`Corrected ${correctedRecords} records with missing months/years`);
        console.log(`Skipped ${skippedRecords} empty records`);
        console.log(`Skipped ${duplicateRecords} duplicate records`);

        mongoose.connection.close(); // Close connection after import
    } catch (error) {
        console.error('Error importing CSV:', error);
        mongoose.connection.close();
    }
};

// Run the import script
importCSV();
