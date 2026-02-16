const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/professional-tax');

const Assessment = require('../src/models/Assessment').default;
const User = require('../src/models/User').default;

async function updateAssessmentsWithTaxpayerNames() {
  try {
    console.log('Starting migration: Adding taxpayerName to assessments...');
    
    // Get all assessments that don't have taxpayerName
    const assessments = await Assessment.find({ taxpayerName: { $exists: false } });
    
    console.log(`Found ${assessments.length} assessments to update`);
    
    for (const assessment of assessments) {
      // Get taxpayer details
      const taxpayer = await User.findById(assessment.taxpayerId);
      
      if (taxpayer) {
        // Update assessment with taxpayer name
        await Assessment.updateOne(
          { _id: assessment._id },
          { 
            $set: { 
              taxpayerName: taxpayer.name 
            } 
          }
        );
        
        console.log(`Updated assessment ${assessment._id} with taxpayer name: ${taxpayer.name}`);
      } else {
        console.log(`Taxpayer not found for assessment ${assessment._id}`);
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the migration
updateAssessmentsWithTaxpayerNames();
