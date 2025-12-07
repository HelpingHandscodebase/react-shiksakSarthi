const { cloudinary } = require('../config/cloudinary');
const Media = require('../models/Media');

// Uploads one or multiple files (multer memoryStorage) to Cloudinary
exports.upload = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const results = [];

    const uploadSingle = (file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'siksha' }, async (error, result) => {
          if (error) return reject(error);
          try {
            const saved = await Media.create({
              url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
              uploadedBy: req.user ? req.user.id : undefined
            });
            resolve(saved);
          } catch (e) {
            reject(e);
          }
        });
        stream.end(file.buffer);
      });

    for (const file of req.files) {
      // eslint-disable-next-line no-await-in-loop
      const r = await uploadSingle(file);
      results.push(r);
    }

    return res.status(201).json({ uploaded: results });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const items = await Media.find().sort({ createdAt: -1 }).limit(100);
    res.json({ count: items.length, items });
  } catch (err) {
    next(err);
  }
};

// Optional: directly list Cloudinary resources (requires API key/secret)
exports.listCloudinary = async (req, res, next) => {
  try {
  // List only resources uploaded under the 'siksha' folder
  // use prefix to restrict results to that folder. Include trailing slash to match folder path.
  // Cloudinary requires the `type` parameter (e.g. 'upload') when listing resources.
  const resources = await cloudinary.api.resources({ max_results: 50, prefix: 'siksha/', type: 'upload' });
    res.json(resources);
  } catch (err) {
    next(err);
  }
};
