import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { config } from "../config";
import { setCredentials, clearCredentials } from "../auth/slice";
import {
  // Auth DTOs
  SignInRequest,
  AccessTokensResponse,
  RefreshTokensRequest,
  // User DTOs
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  // Bot DTOs
  BotResponse,
  CreateBotRequest,
  UpdateBotRequest,
  // Bot Intent DTOs
  BotIntentResponse,
  CreateBotIntentRequest,
  UpdateBotIntentRequest,
  // Chat DTOs
  ChatResponse,
  ChatMessageResponse,
  SendMessageRequest,
  UpdateChatRequest,
  // Message Channel DTOs
  MessageChannelResponse,
  CreateMessageChannelRequest,
  UpdateMessageChannelRequest,
  MessageChannelTypeResponse,
  PairingDataResponse,
} from "./dtos";

export type BaseApiError = FetchBaseQueryError & {
  data: FetchBaseQueryError["data"] & {
    message: string;
    code: number;
    name: string;
  };
};

export const isBaseApiError = (error: unknown): error is BaseApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error &&
    typeof (error as BaseApiError).data === "object" &&
    !!(error as BaseApiError).data &&
    "message" in (error as BaseApiError).data
  );
};

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: config.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    // Get token from auth state
    const state = getState() as { auth: { accessToken: string | null } };
    const token = state.auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Enhanced base query with automatic token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we get a 401 (unauthorized), try to refresh the token
  if (result.error && result.error.status === 401) {
    const state = api.getState() as { auth: { refreshToken: string | null } };
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: "auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Store the new tokens
        api.dispatch(
          setCredentials(refreshResult.data as AccessTokensResponse)
        );

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, clear credentials and redirect to login
        api.dispatch(clearCredentials());
      }
    } else {
      // No refresh token available, clear credentials
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const waiboApi = createApi({
  reducerPath: "waiboApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Bot",
    "BotIntent",
    "Chat",
    "ChatMessage",
    "MessageChannel",
  ],
  endpoints: (builder) => ({
    // Authentication endpoints
    signIn: builder.mutation<AccessTokensResponse, SignInRequest>({
      query: (credentials) => ({
        url: "auth/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [
        "Bot",
        "BotIntent",
        "Chat",
        "ChatMessage",
        "MessageChannel",
        "MessageChannel",
        "User",
      ],
    }),
    refreshTokens: builder.mutation<AccessTokensResponse, RefreshTokensRequest>(
      {
        query: (body) => ({
          url: "auth/refresh",
          method: "POST",
          body,
        }),
      }
    ),

    // User endpoints
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (user) => ({
        url: "user",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<UserResponse[], void>({
      query: () => "user",
      providesTags: ["User"],
    }),
    getUser: builder.query<UserResponse, string>({
      query: (id) => `user/${id}`,
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<
      UserResponse,
      { userId: string; data: UpdateUserRequest }
    >({
      query: ({ userId, data }) => ({
        url: `user/${userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Bot endpoints
    createBot: builder.mutation<BotResponse, CreateBotRequest>({
      query: (bot) => ({
        url: "bot",
        method: "POST",
        body: bot,
      }),
      invalidatesTags: ["Bot"],
    }),
    getMyBots: builder.query<BotResponse[], void>({
      query: () => "bot/user/me",
      providesTags: ["Bot"],
    }),
    getBotsByUserId: builder.query<BotResponse[], string>({
      query: (userId) => `bot/user/${userId}`,
      providesTags: ["Bot"],
    }),
    getBotById: builder.query<BotResponse, string>({
      query: (id) => `bot/${id}`,
      providesTags: ["Bot"],
    }),
    updateBot: builder.mutation<
      BotResponse,
      { id: string; data: UpdateBotRequest }
    >({
      query: ({ id, data }) => ({
        url: `bot/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Bot"],
    }),
    deleteBot: builder.mutation<void, string>({
      query: (id) => ({
        url: `bot/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bot", "BotIntent"],
    }),

    // Bot Intent endpoints
    createBotIntent: builder.mutation<
      BotIntentResponse,
      { botId: string; data: CreateBotIntentRequest }
    >({
      query: ({ botId, data }) => ({
        url: `bot/${botId}/intent`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BotIntent"],
    }),
    getBotIntents: builder.query<BotIntentResponse[], string>({
      query: (botId) => `bot/${botId}/intent`,
      providesTags: ["BotIntent"],
    }),
    updateBotIntent: builder.mutation<
      BotIntentResponse,
      { botId: string; intentId: string; data: UpdateBotIntentRequest }
    >({
      query: ({ botId, intentId, data }) => ({
        url: `bot/${botId}/intent/${intentId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BotIntent"],
    }),
    deleteBotIntent: builder.mutation<
      void,
      { botId: string; intentId: string }
    >({
      query: ({ botId, intentId }) => ({
        url: `bot/${botId}/intent/${intentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BotIntent"],
    }),

    // Chat endpoints
    getChat: builder.query<ChatResponse, string>({
      query: (chatId) => `chat/${chatId}`,
      providesTags: ["Chat"],
    }),
    getChatsByChannelId: builder.query<ChatResponse[], string>({
      query: (channelId) => `chat/channel/${channelId}`,
      providesTags: ["Chat"],
    }),
    getChatMessages: builder.query<ChatMessageResponse[], string>({
      query: (chatId) => `chat/${chatId}/messages`,
      providesTags: ["ChatMessage"],
    }),
    updateChat: builder.mutation<
      ChatResponse,
      { chatId: string; data: UpdateChatRequest }
    >({
      query: ({ chatId, data }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),
    deleteChat: builder.mutation<void, string>({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat", "ChatMessage"],
    }),
    sendMessage: builder.mutation<void, SendMessageRequest>({
      query: (message) => ({
        url: "chat/message",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["ChatMessage"],
    }),

    // Message Channel endpoints
    getAvailableChannelTypes: builder.query<MessageChannelTypeResponse[], void>(
      {
        query: () => "channel/available",
      }
    ),
    getMessageChannel: builder.query<MessageChannelResponse, string>({
      query: (channelId) => `channel/${channelId}`,
      providesTags: ["MessageChannel"],
    }),
    createMessageChannel: builder.mutation<
      MessageChannelResponse,
      CreateMessageChannelRequest
    >({
      query: (channel) => ({
        url: "channel",
        method: "POST",
        body: channel,
      }),
      invalidatesTags: ["MessageChannel"],
    }),
    getMyMessageChannels: builder.query<MessageChannelResponse[], void>({
      query: () => "channel/user/me",
      providesTags: ["MessageChannel"],
    }),
    getMessageChannelsByUserId: builder.query<MessageChannelResponse[], string>(
      {
        query: (userId) => `channel/user/${userId}`,
        providesTags: ["MessageChannel"],
      }
    ),
    updateMessageChannel: builder.mutation<
      MessageChannelResponse,
      { channelId: string; data: UpdateMessageChannelRequest }
    >({
      query: ({ channelId, data }) => ({
        url: `channel/${channelId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MessageChannel"],
    }),
    requestChannelPairing: builder.mutation<PairingDataResponse, string>({
      query: (channelId) => ({
        url: `channel/${channelId}/request-pairing`,
        method: "POST",
      }),
    }),
    disconnectChannel: builder.mutation<MessageChannelResponse, string>({
      query: (channelId) => ({
        url: `channel/${channelId}/disconnect`,
        method: "POST",
      }),
      invalidatesTags: ["MessageChannel"],
    }),
    deleteMessageChannel: builder.mutation<void, string>({
      query: (channelId) => ({
        url: `channel/${channelId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MessageChannel", "Chat"],
    }),
  }),
});

export const {
  // Auth hooks
  useSignInMutation,
  useRefreshTokensMutation,

  // User hooks
  useCreateUserMutation,
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Bot hooks
  useCreateBotMutation,
  useGetMyBotsQuery,
  useGetBotsByUserIdQuery,
  useGetBotByIdQuery,
  useUpdateBotMutation,
  useDeleteBotMutation,

  // Bot Intent hooks
  useCreateBotIntentMutation,
  useGetBotIntentsQuery,
  useUpdateBotIntentMutation,
  useDeleteBotIntentMutation,

  // Chat hooks
  useGetChatQuery,
  useGetChatsByChannelIdQuery,
  useGetChatMessagesQuery,
  useUpdateChatMutation,
  useDeleteChatMutation,
  useSendMessageMutation,

  // Message Channel hooks
  useGetAvailableChannelTypesQuery,
  useGetMessageChannelQuery,
  useCreateMessageChannelMutation,
  useGetMyMessageChannelsQuery,
  useGetMessageChannelsByUserIdQuery,
  useUpdateMessageChannelMutation,
  useRequestChannelPairingMutation,
  useDisconnectChannelMutation,
  useDeleteMessageChannelMutation,
} = waiboApi;
