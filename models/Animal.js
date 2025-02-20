// Model contains animal schema and indexing for faster queries
const mongoose = require('mongoose');

// Define schema for animal shelter data
const AnimalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    breed: {
        type: String,
        required: [true, "Breed is required"],
        trim: true,
        index: true // Indexing for breed type
    },
    age_upon_outcome_in_weeks: {
        type: Number,
        required: [true, "Age upon outcome is required"]
    },
    sex_upon_outcome: {
        type: String,
        enum: ["Intact Male", "Intact Female", "Neutered Male", "Spayed Female", "Unknown"], // Ensure valid values
        default: "Unknown"
    },
    outcome_subtype: {
        type: String,
        trim: true
    },
    outcome_type: {
        type: String,
        required: [true, "Outcome type is required"],
        enum: ["Adoption", "Died", "Disposal", "Euthanasia", "Missing", "Relocate", "Return to Owner", "Rto-Adopt", "Transfer", "Unknown", "Other"] // Limit to valid values
    },
    outcome_month: {
        type: Number,
        min: 1,
        max: 12,
        default: new Date().getMonth() + 1 // Default to current month if missing
    },
    outcome_year: {
        type: Number,
        required: [true, "Outcome year is required"],
        min: [2000, "Year cannot be before 2000"], // Adjust based on dataset
        max: [new Date().getFullYear(), "Future years are not allowed"]
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Standardized case of name and breed
AnimalSchema.pre('save', function(next) {
    // Capitalize each word
    this.name = this.name.replace(/\b\w/g, char => char.toUpperCase()); 
    this.breed = this.breed.replace(/\b\w/g, char => char.toUpperCase()); 
    next();
});

module.exports = mongoose.model('Animal', AnimalSchema);
