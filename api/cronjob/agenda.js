// const Agenda = require('agenda');
// const emailService = require('./verification-email');
// const { VERIFICATION_TYPES } = require('../utils/constants');
// const { MONGO_DB_NAME, MONGO_HOST, MONGO_PORT } = require('../config/email');
// const logData = require('../utils/log-data');
// const userService = require('../service/userService');
// const LoggingData = require('../utils/log-data-object');

// let agendaInstance;

// const initAgenda = async () => {
//   if (agendaInstance) return agendaInstance;

//   console.log('Initializing Agenda');
//   logData(new LoggingData('Agenda initialized', null, null), 'agenda');

//   try {
//     agendaInstance = new Agenda({
//       db: {
//         address: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
//         collection: 'agendaJobs',
//       },
//     });

//     console.log('Database connected');
//     logData(new LoggingData('Agenda database connected', null, null), 'agenda');

//     agendaInstance.define('send verification email', async (job) => {
//       try {
//         const { type, email, token } = job.attrs.data;
//         logData(new LoggingData('Sending verification email', {  type, email, token }, null), 'agenda');

//         switch (type) {
//           case VERIFICATION_TYPES.ACCOUNT_VERIFICATION:
//             await emailService.sendAccountVerification(email, token);
//             break;
//           case VERIFICATION_TYPES.EMAIL_VERIFICATION:
//             await emailService.sendEmailVerification(email, token);
//             break;
//           case VERIFICATION_TYPES.PASSWORD_RESET:
//             await emailService.sendPasswordVerification(email, token);
//             break;
//           case VERIFICATION_TYPES.ACCOUNT_DELETION:
//             await emailService.sendDeleteVerification(email, token);
//             break;
//           default:
//             console.log('Unknown email type:', type);
//             logData(new LoggingData('Unknown email type', {  type, email, token }, 'Unknown Type'), 'agenda');
//         }
//       } catch (e) {
//         error = e;
//         logData(new LoggingData('Agenda definition error', {  type, email, token }, e), 'agenda');
//       }
//     });

//     agendaInstance.define('clear unverified users', async (job) => {
//       try {
//         const clearResult = await userService.clearUnverifiedUsers();
//         if(!clearResult.success) {
//           logData(new LoggingData(clearResult.errorMessage, null, clearResult));
//         }else{
//           logData(new LoggingData(`Cleared ${clearResult.data || '0'} unverified users`, null, null), 'agenda');
//         }
//       } catch (e) {
//         error = e;
//         logData(new LoggingData('Agenda definition error', null, e), 'agenda');
//       }
//     });

//     agendaInstance.every('1 minute', 'clear unverified users');

//     await new Promise((resolve, reject) => {
//       agendaInstance.on('ready', async () => {
//         try {
//           await agendaInstance.start();
//           console.log('Agenda started successfully');
//           logData(new LoggingData('Agenda started successfully', null, null), 'agenda');
//           resolve(agendaInstance);
//         } catch (err) {
//           console.error('Error starting Agenda:', err);
//           logData(new LoggingData('Error starting Agenda', null, err), 'agenda');
//           reject(err);
//         }
//       });

//       agendaInstance.on('error', (err) => {
//         console.error('Agenda error:', err);
//         logData(new LoggingData('Agenda error', null, err), 'agenda');
//         reject(err);
//       });
//     });

//     return agendaInstance;
//   } catch (e) {
//     console.error('Error initializing Agenda:', e);
//     logData(new LoggingData('Error initializing Agenda', null, e), 'agenda');
//     return null;
//   }
// };

// const scheduleVerificationEmail = async (type, email, token) => {
//   const agenda = await initAgenda();
//   if (!agenda) {
//     console.error('Agenda initialization failed');
//     logData(new LoggingData('Agenda initialization failed', null, e), 'agenda');
//     return;
//   }

//   try {
//     const existingJobs = await agenda.jobs({
//       name: 'send verification email',
//       'data.email': email,
//       'data.token': token,
//     });

//     if (existingJobs.length > 0) {
//       await agenda.cancel({
//         name: 'send verification email',
//         'data.email': email,
//         'data.token': token,
//       });
//       logData(new LoggingData('Existing job canceled', {  type, email, token }, null), 'agenda');
//     }

//     agenda.now('send verification email', { type, email, token });
//     logData(new LoggingData('Job scheduled', {  type, email, token }, null), 'agenda');
//   } catch (err) {
//     console.error('Error scheduling job:', err);
//     logData(new LoggingData('Error scheduling job', {  type, email, token }, err), 'agenda');
//   }
// };

// const scheduleAccountVerificationEmail = async (email, token) => {
//   return await scheduleVerificationEmail(VERIFICATION_TYPES.ACCOUNT_VERIFICATION, email, token);
// };

// const scheduleEmailVerificationEmail = async (email, token) => {
//   return await scheduleVerificationEmail(VERIFICATION_TYPES.EMAIL_VERIFICATION, email, token);
// };

// const schedulePasswordResetEmail = async (email, token) => {
//   return await scheduleVerificationEmail(VERIFICATION_TYPES.PASSWORD_RESET, email, token);
// };

// const scheduleAccountDeletionEmail = async (email, token) => {
//   return await scheduleVerificationEmail(VERIFICATION_TYPES.ACCOUNT_DELETION, email, token);
// };

// module.exports = {
//   scheduleAccountVerificationEmail,
//   scheduleEmailVerificationEmail,
//   schedulePasswordResetEmail,
//   scheduleAccountDeletionEmail
// };

const Agenda = require('agenda');
const emailService = require('./verification-email');
const { VERIFICATION_TYPES } = require('../utils/constants');
const { MONGO_DB_NAME, MONGO_HOST, MONGO_PORT } = require('../config/email');
const logData = require('../utils/log-data');
const userService = require('../service/userService');
const LoggingData = require('../utils/log-data-object');

let agendaInstance;

const initAgenda = async () => {
  if (agendaInstance) return agendaInstance;

  console.log('Initializing Agenda');
  logData(new LoggingData('Agenda initialized', null, null), 'agenda');

  try {
    agendaInstance = new Agenda({
      db: {
        address: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
        collection: 'agendaJobs',
      },
    });

    console.log('Database connected');
    logData(new LoggingData('Agenda database connected', null, null), 'agenda');

    agendaInstance.define('send verification email', async (job) => {
      try {
        const { type, email, token } = job.attrs.data;
        logData(new LoggingData('Sending verification email', {  type, email, token }, null), 'agenda');

        switch (type) {
          case VERIFICATION_TYPES.ACCOUNT_VERIFICATION:
            await emailService.sendAccountVerification(email, token);
            break;
          case VERIFICATION_TYPES.EMAIL_VERIFICATION:
            await emailService.sendEmailVerification(email, token);
            break;
          case VERIFICATION_TYPES.PASSWORD_RESET:
            await emailService.sendPasswordVerification(email, token);
            break;
          case VERIFICATION_TYPES.ACCOUNT_DELETION:
            await emailService.sendDeleteVerification(email, token);
            break;
          default:
            console.log('Unknown email type:', type);
            logData(new LoggingData('Unknown email type', {  type, email, token }, 'Unknown Type'), 'agenda');
        }
      } catch (e) {
        error = e;
        logData(new LoggingData('Agenda definition error', {  type, email, token }, e), 'agenda');
      }
    });

    agendaInstance.define('clear unverified users', async (job) => {
      try {
        const clearResult = await userService.clearUnverifiedUsers();
        if (!clearResult.success) {
          logData(new LoggingData(clearResult.errorMessage, null, clearResult));
        } else {
          logData(new LoggingData(`Cleared ${clearResult.data || '0'} unverified users`, null, null), 'agenda');
        }
      } catch (e) {
        logData(new LoggingData('Agenda definition error', null, e), 'agenda');
      }
    });

    await new Promise((resolve, reject) => {
      agendaInstance.on('ready', async () => {
        try {
          await agendaInstance.start();
          await agendaInstance.schedule('1 minute', 'clear unverified users');
          console.log('Agenda started successfully');
          logData(new LoggingData('Agenda started successfully', null, null), 'agenda');
          resolve(agendaInstance);
        } catch (err) {
          console.error('Error starting Agenda:', err);
          logData(new LoggingData('Error starting Agenda', null, err), 'agenda');
          reject(err);
        }
      });

      agendaInstance.on('error', (err) => {
        console.error('Agenda error:', err);
        logData(new LoggingData('Agenda error', null, err), 'agenda');
        reject(err);
      });
    });

    return agendaInstance;
  } catch (e) {
    console.error('Error initializing Agenda:', e);
    logData(new LoggingData('Error initializing Agenda', null, e), 'agenda');
    return null;
  }
};

const startAgenda = async () => {
  await initAgenda();
};

const scheduleVerificationEmail = async (type, email, token) => {
  if (!agendaInstance) {
    console.error('Agenda instance is not initialized');
    return;
  }

  try {
    const existingJobs = await agendaInstance.jobs({
      name: 'send verification email',
      'data.email': email,
      'data.token': token,
    });

    if (existingJobs.length > 0) {
      await agendaInstance.cancel({
        name: 'send verification email',
        'data.email': email,
        'data.token': token,
      });
      logData(new LoggingData('Existing job canceled', { type, email, token }, null), 'agenda');
    }

    agendaInstance.now('send verification email', { type, email, token });
    logData(new LoggingData('Job scheduled', { type, email, token }, null), 'agenda');
  } catch (err) {
    console.error('Error scheduling job:', err);
    logData(new LoggingData('Error scheduling job', { type, email, token }, err), 'agenda');
  }
};

const scheduleAccountVerificationEmail = async (email, token) => {
  return await scheduleVerificationEmail(VERIFICATION_TYPES.ACCOUNT_VERIFICATION, email, token);
};

const scheduleEmailVerificationEmail = async (email, token) => {
  return await scheduleVerificationEmail(VERIFICATION_TYPES.EMAIL_VERIFICATION, email, token);
};

const schedulePasswordResetEmail = async (email, token) => {
  return await scheduleVerificationEmail(VERIFICATION_TYPES.PASSWORD_RESET, email, token);
};

const scheduleAccountDeletionEmail = async (email, token) => {
  return await scheduleVerificationEmail(VERIFICATION_TYPES.ACCOUNT_DELETION, email, token);
};

module.exports = {
  startAgenda,
  scheduleAccountVerificationEmail,
  scheduleEmailVerificationEmail,
  schedulePasswordResetEmail,
  scheduleAccountDeletionEmail
};