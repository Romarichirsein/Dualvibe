import { Resend } from 'resend'; 
const resend = new Resend('re_gUqnFvXN_3xKcXZ6Tvw9CGCvSmVi7ALF6'); 

resend.emails.send({ 
  from: 'DualVibe <onboarding@resend.dev>', 
  to: ['dualvibe237@gmail.com'], 
  subject: 'Test API Resend', 
  html: '<p>Ce test est envoyé depuis le code local.</p>' 
}).then(console.log).catch(console.error);
