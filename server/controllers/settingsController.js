import Setting from '../models/Setting.js';

export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsMap = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // Expecting { key: value, key2: value2 }
    
    for (const [key, value] of Object.entries(updates)) {
      const [setting, created] = await Setting.findOrCreate({
        where: { key },
        defaults: { value: String(value) }
      });
      
      if (!created) {
        await setting.update({ value: String(value) });
      }
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
