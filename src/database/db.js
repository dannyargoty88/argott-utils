/**
 * Argott Database Abstraction Layer (LocalStorage)
 */

const DEFAULT_USERS = [
  { id: "ARG-001", nombre: "Carlos Argoty", email: "carlos@argott.com", rol: "Administrador", estado: "activo", fecha: "2026-09-01" },
  { id: "ARG-002", nombre: "Elena Rostova", email: "elena@argott.com", rol: "Editor", estado: "activo", fecha: "2026-09-04" },
  { id: "ARG-003", nombre: "Miguel Ángel", email: "miguel@argott.com", rol: "Soporte", estado: "pendiente", fecha: "2026-09-07" },
  { id: "ARG-004", nombre: "Sofia Gómez", email: "sofia@argott.com", rol: "Viewer", estado: "inactivo", fecha: "2026-09-08" }
];

const DB = {
  getUsers() {
    const stored = localStorage.getItem(STORAGE_KEY_USERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_USERS;
    }
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  },

  addUser(user) {
    const users = this.getUsers();
    const newId = `ARG-${String(users.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString().split("T")[0];
    const newUser = { id: newId, ...user, fecha: now };
    users.unshift(newUser);
    this.saveUsers(users);
    return newUser;
  },

  deleteUser(id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);
    return users;
  },

  getSettings() {
    const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  },

  resetAllData() {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    this.getUsers();
    this.getSettings();
  }
};
