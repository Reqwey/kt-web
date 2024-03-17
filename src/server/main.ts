import express, { Request, RequestHandler, Response } from "express";
import ViteExpress from "vite-express";
import axios, { AxiosInstance } from "axios";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createServer } from "https";
import { readFileSync } from "fs";
import { URLSearchParams } from "url";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      fetcher?: AxiosInstance;
    }
  }
}

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

const cookies: Map<string, string> = new Map();

const useHeaders: RequestHandler = (req, res, next) => {
  const fetcher = axios.create();

  fetcher.interceptors.request.use(
    (config) => {
      config.method;
      config.headers["User-Agent"] =
        "saturn/2.3.0 (Android 7.0/LingChuang) 2.3.0-base";
      config.headers["Content-Type"] = "application/json";
      config.headers["app-version"] = "2.2.1";
      config.headers["version"] = "2.2.1";
      config.headers["Connection"] = "keep-alive";
      config.headers["serial"] = req.body.sn || req.query.sn || "";
      config.headers["uuid"] = Math.random().toString(36).slice(-8);

      const token = req.query.token || req.body.token;
      if (token) config.headers["authorization"] = `jwt ${token}`;

      const username = req.query.username || req.body.username;
      if (username)
        config.headers["Cookie"] = cookies.get(username as string) || "";

      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );

  // 将 Axios 实例挂载到 req 对象上
  req.fetcher = fetcher;

  next();
};

app.post("/api-login", useHeaders, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!req.fetcher) throw new Error("Fetcher is undefined");

    const response = await req.fetcher.post(
      "https://api.fuulea.com/v2/auth/student/login/",
      { username, password }
    );

    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      cookies.set(username, setCookieHeader.toString());
    }

    return res.json({
      posted: true,
      data: response.data,
    });
  } catch (error: any) {
    // console.log(error.response || error.message);
    return res.json({
      posted: false,
      reason: error.response?.data.detail || error.message,
    });
  }
});

app.get("/api-unfinished-counts", useHeaders, async (req, res) => {
  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/tasks/usertasks/statis/`
    );
    console.log("unfinished-counts got successfully");
    res.json({ ...response.data, success: true });
  } catch (error: any) {
    // console.log("Error fetching unfinished counts:", error.message);
    res.json({ subjects: [], success: false });
  }
});

app.get("/api-task-list/:category", useHeaders, async (req, res) => {
  const { category } = req.params;
  const { page, subjectId, keyword } = req.query as {
    page: string;
    subjectId: string;
    keyword: string;
  };

  try {
    let params = new URLSearchParams({
      pageSize: "10",
      keyword,
      page,
      subjectId,
    });

    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/tasks/usertasks/${category}`,
      {
        params: params,
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json([]);
  }
});

app.get("/api-task-info/:taskId", useHeaders, async (req, res) => {
  const { taskId } = req.params;
  const { userTaskId, detailId } = req.query;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    if (!detailId) {
      if (!userTaskId) throw new Error("API V2 not provided");
      const { data: v1Data } = await req.fetcher.get(
        `https://api.fuulea.com/api/task/${taskId}/?`
      );
      const { data: v2Data } = await req.fetcher.get(
        `https://api.fuulea.com/v2/tasks/usertasks/${userTaskId}/modules/`
      );

      res.json({
        title: v1Data.title,
        firstName: v1Data.first_name,
        unfinishedStudents: v1Data.unfinished_students,
        taskModules: v2Data,
      });
    } else {
      const { data } = await req.fetcher.get(
        `https://api.fuulea.com/v2/tasks/usertasks/${userTaskId}/detail/${detailId}/`
      );

      res.json(data);
    }
  } catch (error: any) {
    console.log(error);
    res.json([]);
  }
});

app.get("/api-paper/:paperId", useHeaders, async (req, res) => {
  const { paperId } = req.params;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/papers/${paperId}/`
    );
    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json([]);
  }
});

app.get("/api-courses/:mode", useHeaders, async (req, res) => {
  const { mode } = req.params;

  try {
    let params = new URLSearchParams({
      page: "1",
      pageSize: "100",
    });

    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/courses/${mode}/`,
      {
        params: params,
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json([]);
  }
});

app.get("/api-course-detail/:id", useHeaders, async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/courses/categories/${id}/`
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json({});
  }
});

app.get("/api-course-detail-chapters/:id", useHeaders, async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.get(
      `https://api.fuulea.com/v2/courses/${id}/chapters`
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json({});
  }
});

app.get(
  "/api-course-detail-modules/:courseId/:chapterId",
  useHeaders,
  async (req, res) => {
    const { courseId, chapterId } = req.params;

    try {
      if (!req.fetcher) throw new Error("Fetcher is undefined");
      const response = await req.fetcher.get(
        `https://api.fuulea.com/v2/courses/${courseId}/chapters/${chapterId}/modules/?includeSystemModel`
      );

      res.json(response.data);
    } catch (error: any) {
      console.log(error);
      res.json({});
    }
  }
);

app.post("/api-mark-finish", useHeaders, async (req, res) => {
  const { taskId, detailId } = req.body;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    const response = await req.fetcher.post(
      `https://api.fuulea.com/v2/tasks/${taskId}/detail/${detailId}/mark-finish/`
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json({});
  }
});

app.post("/api-check-paper", useHeaders, async (req, res) => {
  const { taskId, paperId } = req.body;

  try {
    if (!req.fetcher) throw new Error("Fetcher is undefined");
    let searchParams;
    if (taskId) searchParams = `scene=0&taskId=${taskId}`;
    else searchParams = `scene=1&type=`;
    const response = await req.fetcher.post(
      `https://api.fuulea.com/v2/papers/${paperId}/check/?${searchParams}`,
      { ...req.body }
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    res.json({});
  }
});

if (process.env.PORT && parseInt(process.env.PORT)) {
  if (process.env.NODE_ENV === "production") {
    const server = createServer(
      {
        key: readFileSync("privkey.pem"),
        cert: readFileSync("fullchain.pem"),
      },
      app
    ).listen(parseInt(process.env.PORT), () =>
      console.log("Server is listening on port", process.env.PORT)
    );
    ViteExpress.bind(app, server);
  } else {
    ViteExpress.listen(app, parseInt(process.env.PORT), () =>
      console.log("Server is listening on port", process.env.PORT)
    );
  }
} else {
  throw new Error("Error setting PORT in .env");
}
