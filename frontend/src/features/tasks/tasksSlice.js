import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tasksApi = createApi({
  // This is the key used in the Redux store
  reducerPath: "tasksApi",

  // fetchBaseQuery is RTK Query's built-in fetch wrapper
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000",
    credentials: "include", // sends cookies (needed for refresh token)

    // prepareHeaders runs before every request
    // We use it to attach the JWT token from Redux state
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  // tagTypes are used for cache invalidation
  // When a task is created, we invalidate "Request" tag so the list refreshes
  tagTypes: ["Request"],

  endpoints: (builder) => ({
    // GET /requests with optional filters
    fetchTasks: builder.query({
      query: ({ category = "", search = "", page = 1, limit = 9 } = {}) => {
        // Build query string only with params that have values
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        params.append("page", String(page));
        params.append("limit", String(limit));
        return `/requests?${params.toString()}`;
      },
      providesTags: ["Request"],
    }),

    // GET /requests/:id
    fetchTaskById: builder.query({
      query: (id) => `/requests/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Request", id }],
    }),

    // POST /requests
    createTask: builder.mutation({
      query: (formData) => ({
        url: "/requests",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Request"],
    }),

    // PATCH /requests/:id
    updateTask: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/requests/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [{ type: "Request", id }],
    }),
  }),
});

// Export the auto-generated hooks — one per endpoint
export const {
  useFetchTasksQuery,
  useFetchTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
} = tasksApi;