import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import axios, { AxiosError } from 'axios';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(cookieParser());

interface Headers {
  [key: string]: string;
}

const HEADERS: Headers = {
  "User-Agent": "saturn/2.3.0 (Android 7.0/LingChuang) 2.3.0-base",
  "Content-Type": "application/json",
  "app-version": "2.2.1",
  version: "2.2.1",
  uuid: Math.random().toString(36).slice(-8),
  serial: "",
  authorization: "",
  Connection: "keep-alive",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
};

// 登录请求的体类型定义
interface LoginBody {
  username: string;
  password: string;
  sn: string;
}

// 处理登录的 API 路由
app.post('/api-login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { username, password, sn } = req.body;
  console.log(req.body);
  try {
    HEADERS['serial'] = sn;
    console.log('fetching...');
    const response = await axios.post(
      'https://api.fuulea.com/v2/auth/student/login/',
      { username, password },
      { headers: HEADERS }
    );

    HEADERS['authorization'] = `jwt ${response.data.token}`;
    axios.interceptors.request.use(
      function (config) {
        config.headers.Cookie = response.headers["set-cookie"];
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    console.log("logged in successfully.");
    return res.json({
      posted: true,
      data: response.data,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      posted: false,
      reason: error.response?.data.reason || error.message,
    });
  }
});

app.get('/api-unfinished-counts', async (req: Request, res: Response) => {
  try {
    const response = await axios.get(`https://api.fuulea.com/v2/tasks/usertasks/statis/`, {
      headers: HEADERS,
    });
    console.log("unfinished-counts got successfully");
    res.json({ ...response.data, success: true });
  } catch (error: any) {
    console.log("Error fetching unfinished counts:", error.message);
    res.status(500).json({ subjects: [], success: false });
  }
});

app.get('/api-task-list/:category', async (req: Request, res: Response) => {
  const { category } = req.params;
  const { page, subjectId, keyword } = req.query as { page: string; subjectId: string; keyword: string };

  try {
    let params = new URLSearchParams({
      pageSize: "10",
      keyword,
      page,
      subjectId,
    });

    const response = await axios.get(`https://api.fuulea.com/v2/tasks/usertasks/${category}`, {
      headers: HEADERS,
      params: params,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-task-info/:taskId', async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const response = await axios.get(`https://api.fuulea.com/api/task/${taskId}/?`, {
      headers: HEADERS,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-paper/:paperId', async (req: Request, res: Response) => {
  const { paperId } = req.params;

  try {
    const response = await axios.get(`https://api.fuulea.com/v2/papers/${paperId}/`, {
      headers: { ...HEADERS, authorization: "" },
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-courses/:mode', async (req: Request, res: Response) => {
  const { mode } = req.params;

  try {
    let params = new URLSearchParams({
      page: "1",
      pageSize: "100",
    });

    const response = await axios.get(`https://api.fuulea.com/v2/courses/${mode}/`, {
      headers: HEADERS,
      params: params,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-course-detail/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.fuulea.com/v2/courses/categories/${id}/`, {
      headers: HEADERS,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-course-detail-chapters/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const response = await axios.get(`https://api.fuulea.com/v2/courses/${id}/chapters`, {
      headers: HEADERS,
    });

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

app.get('/api-course-detail-modules/:courseId/:chapterId', async (req: Request, res: Response) => {
  const { courseId, chapterId } = req.params;

  try {
    const response = await axios.get(
      `https://api.fuulea.com/v2/courses/${courseId}/chapters/${chapterId}/modules/?includeSystemModel`,
      {
        headers: HEADERS,
      }
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json([]);
  }
});

// Make sure you define error handling middleware if you want to capture 
// and log or manipulate the responses for Axios errors or other errors.
app.use((error: Error, req: Request, res: Response, next: Function) => {
  // Here you can check if `error` is an instance of `AxiosError`
  // and log it or return a custom response if you need to.
  if (axios.isAxiosError(error)) {
    // Handle Axios error
    const err = error as AxiosError;
    console.error('Axios error: ', err.response?.status, err.response?.data);
    res.status(err.response?.status || 500).json({
      message: err.message,
      error: err.response?.data
    });
  } else {
    // Generic error response
    res.status(500).json({
      message: error.message
    });
  }
});

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});


if (process.env.PORT && parseInt(process.env.PORT)) {
  ViteExpress.listen(app, parseInt(process.env.PORT), () =>
    console.log("Server is listening on port", process.env.PORT)
  )
} else {
  throw new Error('Error setting PORT in .env');
}
