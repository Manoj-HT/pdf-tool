var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// imports
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import { DataStore } from "./dataStore.js";
import path, { dirname } from "path";
import multer from "multer";
import { fileURLToPath } from "url";
// environment configs
dotenv.config();
// database
var pdfs = new DataStore("database/pdfs.json");
var users = new DataStore("database/users.json");
var storage = multer.diskStorage({
    destination: "uploads/documents/",
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        var ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});
// global declarations and middleware
var jwtSecretKey = process.env.JWT_SECRET_KEY;
var app = express();
var port = process.env.PORT;
var upload = multer({ storage: storage });
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var authMiddleware = function (req, res, next) {
    var authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    var token = authorizationHeader.split(" ")[1];
    try {
        var decoded = jwt.verify(token, jwtSecretKey);
        var r = req;
        r.user = decoded;
        next();
    }
    catch (err) {
        console.error("Invalid token:", err.message);
        res.status(401).json({ message: "Unauthorized" });
    }
};
// middleware initialization
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.static(path.join(__dirname, "..", "uploads", "documents")));
// api endpoints
var apis = {
    default: "/",
    login: "/login",
    user: "/user",
    createUser: "/create-user",
    updateUser: "/update-user",
    pdfList: "/pdf-list",
    pdf: "/pdf",
    createPdf: "/create-pdf",
    updatePdf: "/update-pdf",
    pdfListByUserId: "/pdf-list-by-userId",
    uploadPdf: "/upload-pdf",
    downloadPdf: "/download-pdf",
};
// apis
app.get(apis.default, function (req, res) {
    res.send("Hello, You are currently visiting backend server, please go to http://localhost:4200 for UI");
});
app.post(apis.login, function (req, res) {
    var _a = req.body, email = _a.email, password = _a.password;
    var key = btoa(email);
    try {
        var user = users.getById(key), data = {
            time: Date(),
            userId: user.id,
        };
        var token = jwt.sign(data, jwtSecretKey);
        if (password == user.password) {
            res.send({
                user: user,
                token: token,
                message: "succesfully retrieved",
            });
        }
        else {
            res.send({ message: "password doesn't match" });
        }
    }
    catch (err) {
        res.send({ message: "user doesn't exist" });
    }
});
app.post(apis.createUser, function (req, res) {
    var user = req.body;
    user = __assign(__assign({}, user), { id: btoa(user.email), pdfList: [] });
    users.create(user.id, user);
    res.send({ message: "user created", user: user });
    users.save();
});
app.get(apis.user, authMiddleware, function (req, res) {
    var id = req.query.id;
    var user = users.getById(id);
    res.send(user);
});
app.post(apis.pdfList, authMiddleware, function (req, res) {
    var pdfList = req.body.pdfList;
    var pdfs = users.getByIdList.apply(users, pdfList);
    for (var _i = 0, pdfs_1 = pdfs; _i < pdfs_1.length; _i++) {
        var pdf = pdfs_1[_i];
        delete pdf.data;
    }
    res.send({ pdfs: pdfs });
});
app.put(apis.updateUser, authMiddleware, function (req, res) {
    var updateValue = req.body;
    var originalValue = users.getById(updateValue.id);
    originalValue = __assign(__assign({}, originalValue), updateValue);
    users.update(originalValue.id, originalValue);
    res.send({ message: "updated", originalValue: originalValue });
    users.save();
});
app.delete(apis.user, authMiddleware, function (req, res) {
    var id = req.query.id;
    users.delete(id);
    res.send({ message: "Deleted" });
    users.save();
});
app.get(apis.pdfListByUserId, authMiddleware, function (req, res) {
    var userId = req.query.id;
    var user = users.getById(userId);
    var pdfList = [];
    try {
        pdfList = JSON.parse(JSON.stringify(pdfs.getByIdList.apply(pdfs, user.pdfList)));
    }
    catch (err) {
        console.log(err);
    }
    finally {
        if ((pdfList === null || pdfList === void 0 ? void 0 : pdfList.length) != 0) {
            for (var _i = 0, pdfList_1 = pdfList; _i < pdfList_1.length; _i++) {
                var pdf = pdfList_1[_i];
                delete pdf.data;
            }
        }
        res.send(pdfList);
    }
});
app.post(apis.createPdf, authMiddleware, function (req, res) {
    var pdf = req.body;
    var createdDate = new Date();
    var id = btoa(pdf.name) + btoa(createdDate.toDateString());
    pdf = __assign(__assign({}, pdf), { id: id, createdDate: createdDate, data: {} });
    pdfs.create(pdf.id, pdf);
    var user = users.getById(pdf.userId);
    var pdfList = user.pdfList;
    pdfList.push(id);
    user = __assign(__assign({}, user), { pdfList: pdfList });
    pdfs.save();
    users.save();
    res.send({ message: "created succesfully", pdf: pdf });
});
app.get(apis.pdf, authMiddleware, function (req, res) {
    var id = req.query.id;
    var pdf = pdfs.getById(id);
    res.send(pdf);
});
app.put(apis.updatePdf, authMiddleware, function (req, res) {
    var updateValue = req.body;
    var originalValue = pdfs.getById(updateValue.id);
    originalValue = __assign(__assign({}, originalValue), updateValue);
    pdfs.update(originalValue.id, originalValue);
    pdfs.save();
    res.send({ message: "updated succesfully" });
});
app.delete(apis.pdf, authMiddleware, function (req, res) {
    var id = req.query.id;
    pdfs.delete(id);
    res.send({ message: "Deleted" });
    pdfs.save();
});
app.post(apis.uploadPdf, upload.single("file"), authMiddleware, function (req, res) {
    var file = req.file;
    var fileName = file === null || file === void 0 ? void 0 : file.filename;
    res.send({
        message: "file uploaded at location ".concat(fileName),
        fileName: fileName,
    });
});
app.get(apis.downloadPdf, function (req, res) {
    var fileName = req.query.fileName;
    var filePath = path.join(__dirname, "..", "uploads", "documents", fileName);
    res.download(filePath, fileName);
});
// server
app.listen(port, function () {
    console.log("Backend server running at http://localhost:".concat(port, ", goto http://localhost:4200 for UI"));
});
//# sourceMappingURL=index.js.map