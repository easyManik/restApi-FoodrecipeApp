const multer = require("multer");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./tmp");
  },
  filename(req, file, cb) {
    const uniq = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniq}.png`);
  },
});

const upload = multer({
  storage,
  limits: {
    fieldNameSize: 300,
    fileSize: 248576, // 2 Mb
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

module.exports = upload;
