const mongoose = require('mongoose');
const Assessment = require('../src/models/Assessment');

// MongoDB connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/taxtrackerDB';

async function updateAssessmentStatus() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all assessments with old status values
    const updateResult = await Assessment.updateMany(
      { 
        status: { $in: ['Unpaid', 'Partially Paid', 'Paid'] }
      },
      [
        {
          $set: {
            status: {
              $switch: {
                branches: [
                  { case: { $eq: ['$status', 'Unpaid'] }, then: 'unpaid' },
                  { case: { $eq: ['$status', 'Partially Paid'] }, then: 'partially_paid' },
                  { case: { $eq: ['$status', 'Paid'] }, then: 'paid' }
                ],
                default: 'unpaid'
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${updateResult.modifiedCount} assessments`);

    // Verify the update
    const assessments = await Assessment.find({});
    console.log('Current status values in database:');
    const statusCounts = {};
    assessments.forEach(assessment => {
      statusCounts[assessment.status] = (statusCounts[assessment.status] || 0) + 1;
    });
    console.log(statusCounts);

  } catch (error) {
    console.error('Error updating assessment status:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateAssessmentStatus();
