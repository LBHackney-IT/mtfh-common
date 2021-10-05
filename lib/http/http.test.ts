import { request, server } from "@hackney/mtfh-test-utils";
import { rest } from "msw";
import { $options, axiosInstance, createCancelToken, isAxiosError } from "./http";

const defaultRequest = { path: "/api", code: 200 };

describe("axiosInstance", () => {
  Object.defineProperty(window, "location", {
    value: {
      href: "http://localhost/",
      origin: "http://localhost",
      reload: jest.fn(),
    },
    writable: true,
  });

  test("it calls with Authorization header", async () => {
    request({ method: "get", ...defaultRequest, data: "success" });

    const res = await axiosInstance.get("/api");

    expect(res.data).toBe("success");
  });

  test("it throws an error on bad request", () => {
    request({ method: "get", ...defaultRequest, data: "failure", code: 500 });

    return expect(axiosInstance.get("/api")).rejects.toThrow();
  });

  test("it will logout on 403", async () => {
    request({ method: "get", ...defaultRequest, data: "failure", code: 403 });
    try {
      await axiosInstance.get("/api");
    } catch (e) {
      expect(isAxiosError(e)).toBe(true);
    }
    expect(window.location.reload).toBeCalledTimes(1);
  });

  test("it can generate a cancel token", () => {
    const source = createCancelToken();
    expect(source.token).toBeTruthy();
  });

  test("etag is appended to response in get request", async () => {
    server.use(
      rest.get("/api", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.set("ETag", '"1"'),
          ctx.json({ id: "70a8d798-d707-4eee-8c9e-7fe1ecaf42cb" }),
        );
      }),
    );

    const res = await axiosInstance.get("/api");

    expect(res.data.etag).toBe('"1"');
  });

  test("etag in patch data is appended to If-Match header", async () => {
    server.use(
      rest.patch("/api", (req, res, ctx) => {
        if (req.headers?.has("If-Match")) {
          return res.once(ctx.status(200), ctx.json(req.body));
        }
        return res.once(ctx.status(500), ctx.json({ error: "failed" }));
      }),
    );

    const res = await axiosInstance.patch("/api", {
      id: "70a8d798-d707-4eee-8c9e-7fe1ecaf42cb",
      etag: "1",
    });

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({
      id: "70a8d798-d707-4eee-8c9e-7fe1ecaf42cb",
    });
  });

  test("If-Match header is not sent when no etag is provided", async () => {
    server.use(
      rest.patch("/api", (req, res, ctx) => {
        if (req.headers?.has("If-Match")) {
          return res.once(ctx.status(500), ctx.json({ error: "failed" }));
        }
        return res.once(ctx.status(200), ctx.json({ success: true }));
      }),
    );

    const res = await axiosInstance.patch("/api");

    expect(res.status).toBe(200);
    expect(res.data).toStrictEqual({ success: true });
  });

  test("x-correlation-id is appended to the request headers when feature toggle is on", async () => {
    $options.next({
      xCorrelationId: true,
    });
    server.use(
      rest.get("/api", (req, res, ctx) => {
        if (req.headers?.has("x-correlation-id")) {
          return res.once(ctx.status(200));
        }
        return res.once(ctx.status(500));
      }),
    );

    const res = await axiosInstance.get("/api");

    expect(res.status).toBe(200);
  });
});
