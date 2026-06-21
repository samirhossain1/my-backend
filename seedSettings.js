const mongoose = require('mongoose');
const Setting = require('./models/Setting');
require('dotenv').config();

const defaultSettings = [
  { key: 'appVersion', value: '1.0.0', description: 'Current app version' },
  { key: 'forceUpdate', value: false, description: 'Force update enabled/disabled' },
  { key: 'maintenanceMode', value: false, description: 'Maintenance mode on/off' },
  { key: 'apiBaseUrl', value: 'http://localhost:5000/api', description: 'API base URL' },
  { key: 'defaultQuality', value: '720p', description: 'Default stream quality' },
  { key: 'maxViewers', value: 1000, description: 'Maximum viewers limit' },
  { key: 'serverLoadThreshold', value: 80, description: 'Server load warning threshold (%)' }
];

mongoose.connect('mongodb://127.0.0.1:27017/myDatabase')
  .then(async () => {
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        setting,
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default settings seeded!');
    process.exit();
  })
  .catch(err => console.error(err));