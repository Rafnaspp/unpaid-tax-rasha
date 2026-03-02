const mongoose = require('mongoose');
const Assessment = require('../src/models/Assessment');
const User = require('../src/models/User');
const Reminder = require('../src/models/Reminder');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/taxtrackerDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function generateAutoReminders() {
  try {
    console.log('Starting automatic reminder generation...');
    
    // Get all unpaid assessments with due dates
    const unpaidAssessments = await Assessment.find({
      $or: [
        { status: 'unpaid' },
        { status: 'partially_paid' }
      ]
    }).populate('taxpayerId', 'name businessName email');
    
    console.log(`Found ${unpaidAssessments.length} unpaid assessments`);
    
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    console.log(`One month from now: ${oneMonthFromNow.toLocaleDateString('en-IN')}`);
    
    let remindersCreated = 0;
    
    for (const assessment of unpaidAssessments) {
      const dueDate = new Date(assessment.dueDate);
      
      console.log(`\nChecking assessment: ${assessment.financialYear}`);
      console.log(`Due Date: ${dueDate.toLocaleDateString('en-IN')}`);
      console.log(`Taxpayer: ${assessment.taxpayerId.name}`);
      console.log(`Status: ${assessment.status}`);
      
      // Check if due date is within 1 month from now
      if (dueDate <= oneMonthFromNow && dueDate > new Date()) {
        console.log(`✅ Assessment qualifies for reminder (due within 1 month)`);
        
        // Check if reminder already exists for this assessment
        const existingReminder = await Reminder.findOne({
          assessmentId: assessment._id,
          taxpayerId: assessment.taxpayerId._id
        });
        
        if (!existingReminder) {
          // Create automatic reminder
          const reminder = new Reminder({
            taxpayerId: assessment.taxpayerId._id,
            assessmentId: assessment._id,
            title: `Tax Payment Due - ${assessment.financialYear}`,
            message: `Dear ${assessment.taxpayerId.name}, your professional tax assessment for ${assessment.financialYear} (${assessment.slabName}) is due on ${dueDate.toLocaleDateString('en-IN')}. Current balance: ₹${assessment.balance?.toLocaleString('en-IN') || 0}. Please make your payment before the due date to avoid penalties.`,
            createdBy: 'System',
            createdAt: new Date()
          });
          
          await reminder.save();
          remindersCreated++;
          
          console.log(`🎉 Created reminder for ${assessment.taxpayerId.name} - Assessment: ${assessment.financialYear} (Due: ${dueDate.toLocaleDateString('en-IN')})`);
        } else {
          console.log(`⚠️ Reminder already exists for assessment ${assessment.financialYear}`);
        }
      } else {
        console.log(`❌ Assessment does not qualify (due: ${dueDate.toLocaleDateString('en-IN')}, not within 1 month)`);
      }
    }
    
    console.log(`\nAuto-reminder generation completed. Created ${remindersCreated} new reminders.`);
    
  } catch (error) {
    console.error('Error generating auto reminders:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
generateAutoReminders();
