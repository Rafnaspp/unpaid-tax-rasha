// Test date logic for March 30, 2026 assessment
const today = new Date();
console.log('Today:', today.toLocaleDateString('en-IN'));

const assessmentDueDate = new Date('2026-03-30');
console.log('Assessment Due Date:', assessmentDueDate.toLocaleDateString('en-IN'));

const oneMonthFromNow = new Date();
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
console.log('One Month From Now:', oneMonthFromNow.toLocaleDateString('en-IN'));

// Check conditions
const condition1 = assessmentDueDate <= oneMonthFromNow;
const condition2 = assessmentDueDate > today;
const shouldCreateReminder = condition1 && condition2;

console.log('\nCondition Checks:');
console.log('Due Date <= One Month From Now:', condition1);
console.log('Due Date > Today:', condition2);
console.log('Should Create Reminder:', shouldCreateReminder);

console.log('\nDetailed:');
console.log('Days until due:', Math.ceil((assessmentDueDate - today) / (1000 * 60 * 60 * 24)));
console.log('Days in one month window:', Math.ceil((oneMonthFromNow - today) / (1000 * 60 * 60 * 24)));
