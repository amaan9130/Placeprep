import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isInMemory } from './db.js';

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  _newId() {
    return new mongooseObjectId();
  }

  _match(doc, query = {}) {
    for (const key of Object.keys(query)) {
      if (key === '$or') {
        const matchesOr = query.$or.some(subQuery => this._match(doc, subQuery));
        if (!matchesOr) return false;
        continue;
      }
      if (key === '$and') {
        const matchesAnd = query.$and.every(subQuery => this._match(doc, subQuery));
        if (!matchesAnd) return false;
        continue;
      }

      const val = this._getProp(doc, key);
      const qVal = query[key];

      if (qVal && typeof qVal === 'object' && !Array.isArray(qVal) && !(qVal instanceof RegExp) && !(qVal instanceof mongooseObjectId)) {
        if (qVal.$in && Array.isArray(qVal.$in)) {
          const strVal = String(val?._id || val);
          const inMatches = qVal.$in.some(item => String(item?._id || item) === strVal || (Array.isArray(val) && val.some(v => String(v?._id || v) === String(item?._id || item))));
          if (!inMatches) return false;
        } else if (qVal.$nin && Array.isArray(qVal.$nin)) {
          const strVal = String(val?._id || val);
          if (qVal.$nin.some(item => String(item) === strVal)) return false;
        } else if (qVal.$gte !== undefined && Number(val) < Number(qVal.$gte)) {
          return false;
        } else if (qVal.$lte !== undefined && Number(val) > Number(qVal.$lte)) {
          return false;
        } else if (qVal.$gt !== undefined && Number(val) <= Number(qVal.$gt)) {
          return false;
        } else if (qVal.$lt !== undefined && Number(val) >= Number(qVal.$lt)) {
          return false;
        } else if (qVal.$ne !== undefined && String(val) === String(qVal.$ne)) {
          return false;
        } else if (qVal.$regex) {
          const regex = new RegExp(qVal.$regex, qVal.$options || '');
          if (!regex.test(String(val || ''))) return false;
        }
      } else if (qVal instanceof RegExp) {
        if (!qVal.test(String(val || ''))) return false;
      } else if (qVal !== undefined) {
        if (String(val?._id || val) !== String(qVal?._id || qVal)) {
          return false;
        }
      }
    }
    return true;
  }

  _getProp(obj, path) {
    if (!obj) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const part of parts) {
      if (cur === undefined || cur === null) return undefined;
      cur = cur[part];
    }
    return cur;
  }

  async countDocuments(query = {}) {
    return this.docs.filter(d => this._match(d, query)).length;
  }

  async deleteMany(query = {}) {
    const prevCount = this.docs.length;
    this.docs = this.docs.filter(d => !this._match(d, query));
    return { deletedCount: prevCount - this.docs.length };
  }

  find(query = {}) {
    const matches = this.docs.filter(d => this._match(d, query)).map(d => this._wrapDoc(d));
    return new MemoryQuery(matches);
  }

  findOne(query = {}) {
    const doc = this.docs.find(d => this._match(d, query));
    const wrapped = doc ? this._wrapDoc(doc) : null;
    return new MemorySingleQuery(wrapped);
  }

  findById(id) {
    const targetId = String(id?._id || id);
    const doc = this.docs.find(d => String(d._id) === targetId);
    const wrapped = doc ? this._wrapDoc(doc) : null;
    return new MemorySingleQuery(wrapped);
  }

  async findByIdAndUpdate(id, update = {}, options = {}) {
    const targetId = String(id?._id || id);
    const idx = this.docs.findIndex(d => String(d._id) === targetId);
    if (idx === -1) return null;
    const current = this.docs[idx];
    const updated = { ...current, ...update, updatedAt: new Date() };
    this.docs[idx] = updated;
    return this._wrapDoc(updated);
  }

  async findOneAndUpdate(query = {}, update = {}, options = {}) {
    const idx = this.docs.findIndex(d => this._match(d, query));
    if (idx === -1) {
      if (options.upsert) {
        return this.create({ ...query, ...update });
      }
      return null;
    }
    const current = this.docs[idx];
    const updated = { ...current, ...update, updatedAt: new Date() };
    this.docs[idx] = updated;
    return this._wrapDoc(updated);
  }

  async updateMany(query = {}, update = {}) {
    let count = 0;
    this.docs = this.docs.map(d => {
      if (this._match(d, query)) {
        count++;
        return { ...d, ...update, updatedAt: new Date() };
      }
      return d;
    });
    return { modifiedCount: count };
  }

  async create(data) {
    if (Array.isArray(data)) {
      return this.insertMany(data);
    }
    let plain = { ...data };
    if (!plain._id) plain._id = this._newId();
    if (!plain.createdAt) plain.createdAt = new Date();
    if (plain.isActive === undefined) plain.isActive = true;
    if (plain.isEmailVerified === undefined) plain.isEmailVerified = true;
    plain.updatedAt = new Date();

    if (plain.password && !plain.password.startsWith('$2a$') && !plain.password.startsWith('$2b$')) {
      plain.password = bcrypt.hashSync(plain.password, 10);
    }

    this.docs.push(plain);
    return this._wrapDoc(plain);
  }

  async insertMany(arr = []) {
    const created = [];
    for (const item of arr) {
      const doc = await this.create(item);
      created.push(doc);
    }
    return created;
  }

  _wrapDoc(raw) {
    const self = this;
    const doc = { ...raw };

    doc.toObject = function() {
      const clean = {};
      for (const [k, v] of Object.entries(doc)) {
        if (typeof v !== 'function') clean[k] = v;
      }
      return clean;
    };

    doc.toJSON = function() {
      const clean = {};
      for (const [k, v] of Object.entries(doc)) {
        if (typeof v !== 'function') clean[k] = v;
      }
      return clean;
    };

    doc.save = async function() {
      const idx = self.docs.findIndex(d => String(d._id) === String(doc._id));
      const clean = doc.toObject();
      if (idx !== -1) {
        self.docs[idx] = { ...clean, updatedAt: new Date() };
      } else {
        self.docs.push(clean);
      }
      return doc;
    };

    doc.deleteOne = async function() {
      self.docs = self.docs.filter(d => String(d._id) !== String(doc._id));
      return { deletedCount: 1 };
    };

    doc.populate = async function(pathOrOpts, select) {
      await populateDoc(doc, pathOrOpts, select);
      return doc;
    };

    doc.matchPassword = async function(entered) {
      return bcrypt.compare(entered, raw.password || '');
    };

    doc.getSignedJwtToken = function() {
      return jwt.sign(
        { id: String(doc._id), role: doc.role, name: doc.name, email: doc.email },
        'placeprep_production_secure_jwt_secret_key_2026_9988',
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );
    };

    return doc;
  }
}

class mongooseObjectId {
  constructor(id) {
    this._id = id || crypto.randomBytes(12).toString('hex');
  }
  toString() {
    return this._id;
  }
  valueOf() {
    return this._id;
  }
  toJSON() {
    return this._id;
  }
}

class MemorySingleQuery {
  constructor(doc) {
    this._doc = doc;
  }
  select(fields) {
    return this;
  }
  populate(pathOrOpts, select) {
    if (this._doc) {
      populateDoc(this._doc, pathOrOpts, select);
    }
    return this;
  }
  then(resolve, reject) {
    return Promise.resolve(this._doc).then(resolve, reject);
  }
}

class MemoryQuery {
  constructor(data) {
    this._data = [...data];
  }

  select(fields) {
    return this;
  }

  sort(sortObj = {}) {
    const key = Object.keys(sortObj)[0];
    if (key) {
      const dir = sortObj[key];
      this._data.sort((a, b) => {
        const valA = a[key] || 0;
        const valB = b[key] || 0;
        return dir === 1 || dir === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }
    return this;
  }

  limit(num) {
    this._data = this._data.slice(0, Number(num));
    return this;
  }

  skip(num) {
    this._data = this._data.slice(Number(num));
    return this;
  }

  populate(pathOrOpts, select) {
    for (const doc of this._data) {
      populateDoc(doc, pathOrOpts, select);
    }
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(this._data).then(resolve, reject);
  }
}

function populateDoc(doc, pathOrOpts, select) {
  let pathStr = typeof pathOrOpts === 'string' ? pathOrOpts : pathOrOpts?.path;
  let subPopulate = typeof pathOrOpts === 'object' ? pathOrOpts?.populate : null;

  if (!pathStr) return;

  const targetId = doc[pathStr];
  if (!targetId) return;

  for (const storeName of Object.keys(memoryStores)) {
    const found = memoryStores[storeName].docs.find(d => String(d._id) === String(targetId._id || targetId));
    if (found) {
      doc[pathStr] = memoryStores[storeName]._wrapDoc(found);
      if (subPopulate) {
        populateDoc(doc[pathStr], subPopulate);
      }
      break;
    }
  }
}

export const memoryStores = {
  User: new MemoryCollection('User'),
  StudentProfile: new MemoryCollection('StudentProfile'),
  Company: new MemoryCollection('Company'),
  Job: new MemoryCollection('Job'),
  Application: new MemoryCollection('Application'),
  PlacementDrive: new MemoryCollection('PlacementDrive'),
  AptitudeQuestion: new MemoryCollection('AptitudeQuestion'),
  TestResult: new MemoryCollection('TestResult'),
  CodingQuestion: new MemoryCollection('CodingQuestion'),
  CodingSubmission: new MemoryCollection('CodingSubmission'),
  TechnicalQuestion: new MemoryCollection('TechnicalQuestion'),
  HRQuestion: new MemoryCollection('HRQuestion'),
  InterviewPractice: new MemoryCollection('InterviewPractice'),
  Notification: new MemoryCollection('Notification'),
  Announcement: new MemoryCollection('Announcement')
};

export const getModel = (name, mongooseModel) => {
  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (process.env.USE_MEMORY_STORE === 'true' || isInMemory || (!process.env.MONGO_URI && !target.db?.readyState)) {
        const mem = memoryStores[name];
        if (mem && prop in mem) {
          return typeof mem[prop] === 'function' ? mem[prop].bind(mem) : mem[prop];
        }
      }
      return target[prop];
    }
  });
};