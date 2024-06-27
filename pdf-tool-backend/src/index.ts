// imports
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";
import { DataStore } from "./dataStore.js";
import { User } from "./models/user.js";
import { ApiResponse } from "./models/apiResponse.js";
import { PDF } from "./models/pdf.js";
import path, { dirname } from "path";
import multer from "multer";
import { fileURLToPath } from "url";

// environment configs
dotenv.config();

// database
const pdfs = new DataStore("database/pdfs.json");
const users = new DataStore("database/users.json");
const storage = multer.diskStorage({
  destination: "uploads/documents/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// global declarations and middleware
const jwtSecretKey = process.env.JWT_SECRET_KEY as jwt.Secret;
const app = express();
const port = process.env.PORT;
const upload = multer({ storage: storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).json({ message: "Unauthorized" } as ApiResponse);
  }
  const token = authorizationHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    let r = req as any;
    r.user = decoded;
    next();
  } catch (err: any) {
    console.error("Invalid token:", err.message);
    res.status(401).json({ message: "Unauthorized" } as ApiResponse);
  }
};

// middleware initialization
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "..", "uploads", "documents")));

// api endpoints
const apis = {
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
app.get(apis.default, (req, res) => {
  res.send(
    `Hello, You are currently visiting backend server, please go to http://localhost:4200 for UI`
  );
});

app.post(apis.login, (req, res) => {
  const { email, password } = req.body;
  let key = btoa(email);
  try {
    let user = users.getById(key) as User,
      data = {
        time: Date(),
        userId: user.id,
      };
    const token = jwt.sign(data, jwtSecretKey);
    if (password == user.password) {
      res.send({
        user,
        token,
        message: "succesfully retrieved",
      } as ApiResponse);
    } else {
      res.send({ message: "password doesn't match" } as ApiResponse);
    }
  } catch (err: any) {
    res.send({ message: "user doesn't exist" } as ApiResponse);
  }
});

app.post(apis.createUser, (req, res) => {
  let user = req.body as User;
  user = {
    ...user,
    id: btoa(user.email),
    pdfList: [""],
  };
  users.create(user.id, user);
  res.send({ message: "user created", user } as ApiResponse);
  users.save();
});

app.get(apis.user, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  let user = users.getById(id) as User;
  res.send(user);
});

app.post(apis.pdfList, authMiddleware, (req, res) => {
  const { pdfList } = req.body as User;
  let pdfs = users.getByIdList(...pdfList) as PDF[];
  for (let pdf of pdfs) {
    delete pdf.data;
  }
  res.send({ pdfs });
});

app.put(apis.updateUser, authMiddleware, (req, res) => {
  let updateValue = req.body as User;
  let originalValue = users.getById(updateValue.id) as User;
  originalValue = {
    ...originalValue,
    ...updateValue,
  };
  users.update(originalValue.id, originalValue);
  res.send({ message: "updated", originalValue } as ApiResponse);
  users.save();
});

app.delete(apis.user, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  users.delete(id);
  res.send({ message: "Deleted" } as ApiResponse);
  users.save();
});

app.get(apis.pdfListByUserId, authMiddleware, (req, res) => {
  let userId = req.query.id as string;
  let user = users.getById(userId) as User;
  let pdfList: PDF[] = [];
  try {
    pdfList = JSON.parse(
      JSON.stringify(pdfs.getByIdList(...user.pdfList))
    ) as PDF[];
  } catch (err) {
    console.log(err);
  } finally {
    if (pdfList?.length != 0) {
      for (let pdf of pdfList) {
        delete pdf.data;
      }
    }
    res.send(pdfList);
  }
});

app.post(apis.createPdf, authMiddleware, (req, res) => {
  let pdf = req.body as PDF;
  let createdDate = new Date();
  let id = btoa(pdf.name) + btoa(createdDate.toDateString());
  pdf = { ...pdf, id, createdDate, data: {} };
  pdfs.create(pdf.id, pdf);
  let user = users.getById(pdf.userId) as User;
  let pdfList = user.pdfList;
  pdfList.push(id);
  user = {
    ...user,
    pdfList,
  };
  pdfs.save();
  users.save();
  res.send({ message: "created succesfully", pdf } as ApiResponse);
});

app.get(apis.pdf, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  let pdf = pdfs.getById(id);
  res.send(pdf);
});

app.put(apis.updatePdf, authMiddleware, (req, res) => {
  let updateValue = req.body as PDF;
  let originalValue = pdfs.getById(updateValue.id);
  originalValue = {
    ...originalValue,
    ...updateValue,
  };
  pdfs.update(originalValue.id, originalValue);
  pdfs.save();
  res.send({ message: "updated succesfully" } as ApiResponse);
});

app.delete(apis.pdf, authMiddleware, (req, res) => {
  let id = req.query.id as string;
  pdfs.delete(id);
  res.send({ message: "Deleted" } as ApiResponse);
  pdfs.save();
});

app.post(apis.uploadPdf, upload.single("file"), authMiddleware, (req, res) => {
  const file = req.file;
  const fileName = file?.filename;
  res.send({
    message: `file uploaded at location ${fileName}`,
    fileName,
  } as ApiResponse);
});

app.get(apis.downloadPdf, (req, res) => {
  const fileName = req.query.fileName as string;
  const filePath = path.join(__dirname, "..", "uploads", "documents", fileName);
  res.download(filePath, fileName);
});

// server
app.listen(port, () => {
  console.log(
    `Backend server running at http://localhost:${port}, goto http://localhost:4200 for UI`
  );
});
