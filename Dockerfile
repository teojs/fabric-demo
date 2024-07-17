FROM node:18 as builder

WORKDIR /app

COPY package.json yarn.lock* ./

# 安装依赖，使用 BuildKit 的缓存挂载功能来缓存 node_modules
# 缓存将在 /root/.yarn-cache 目录下保持
RUN --mount=type=cache,target=/root/.yarn-cache yarn --frozen-lockfile

COPY . .

ARG BUILD_ENV=prod
ENV BUILD_ENV=${BUILD_ENV}
RUN if [ "$BUILD_ENV" = "prod" ]; \
      then yarn build:prod; \
      else yarn build; \
    fi

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /opt/heran-media-front

EXPOSE 22 80 443 2199

ENTRYPOINT ["nginx", "-g", "daemon off;"]
